import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'administrator' | 'farm' | 'customer';

export interface AuthUser extends User {
  role?: UserRole;
  full_name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdministrator: () => boolean;
  isFarmUser: () => boolean;
  isCustomer: () => boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Max loading timeout
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout, forcing completion');
        setLoading(false);
      }
    }, 20000);

    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }
        
        console.log('Session retrieved:', session ? 'Found' : 'None');
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session ? 'with session' : 'no session');
      
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setSession(null);
        setLoading(false);
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        setSession(session);
        await fetchUserProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User, retryCount = 0) => {
    console.log(`Fetching profile for user: ${authUser.id} (attempt ${retryCount + 1})`);
    
    try {
      // Add a small delay for the first retry to allow RLS policies to settle
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

      // Try to get the user profile with better error handling
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        if (error.code === 'PGRST116') {
          // User doesn't exist, try to create
          console.log('User profile not found, attempting to create...');
          await createUserProfile(authUser);
          return;
        } 
        
        if ((error.message?.includes('permission denied') || error.code === '42501') && retryCount < 2) {
          // RLS policy issue, retry up to 2 times
          console.warn(`RLS permission denied, retrying... (${retryCount + 1}/3)`);
          await fetchUserProfile(authUser, retryCount + 1);
          return;
        }
        
        if (error.code === 'PGRST301' && retryCount < 2) {
          // Multiple rows returned, this shouldn't happen but let's handle it
          console.warn('Multiple user records found, using first one');
          const { data: multiData, error: multiError } = await supabase
            .from('users')
            .select('role, full_name, email, is_active')
            .eq('id', authUser.id)
            .limit(1)
            .single();
            
          if (!multiError && multiData) {
            setUserWithProfile(authUser, multiData);
            return;
          }
        }
        
        // For any other error after retries, use fallback
        console.warn('Using fallback user data after error:', error.message);
        setUserWithFallback(authUser);
        
      } else if (data) {
        // Success - we got the user profile
        console.log('Profile successfully fetched:', {
          role: data.role,
          full_name: data.full_name,
          is_active: data.is_active
        });
        
        if (!data.is_active) {
          console.warn('User account is inactive');
          // You might want to handle inactive users differently
        }
        
        setUserWithProfile(authUser, data);
      } else {
        // No error but no data - shouldn't happen
        console.warn('No error but no data returned, using fallback');
        setUserWithFallback(authUser);
      }
      
    } catch (error) {
      console.error('Profile fetch exception:', error);
      if (retryCount < 2) {
        console.log(`Retrying profile fetch... (${retryCount + 1}/3)`);
        await fetchUserProfile(authUser, retryCount + 1);
      } else {
        setUserWithFallback(authUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: User) => {
    console.log('Creating user profile for:', authUser.email);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: 'customer' as UserRole,
            is_active: true
          }
        ])
        .select('role, full_name, email, is_active')
        .single();

      if (error) {
        console.error('Profile creation failed:', error);
        setUserWithFallback(authUser);
      } else {
        console.log('Profile created successfully:', data);
        setUserWithProfile(authUser, data);
      }
    } catch (error) {
      console.error('Profile creation exception:', error);
      setUserWithFallback(authUser);
    }
  };

  const setUserWithProfile = (authUser: User, profileData: any) => {
    setUser({
      ...authUser,
      role: profileData.role,
      full_name: profileData.full_name
    });
  };

  const setUserWithFallback = (authUser: User) => {
    console.warn('Using fallback user data - Management features may not be available');
    setUser({
      ...authUser,
      role: 'customer', // Default fallback role
      full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
    });
  };

  const refreshUserProfile = async () => {
    if (session?.user) {
      console.log('Manually refreshing user profile...');
      await fetchUserProfile(session.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    console.log('Sign in successful');
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    console.log('Attempting sign up for:', email, 'with role:', role);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    // Try to create the user profile with the specified role
    if (data.user && data.session) {
      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              role: role,
              is_active: true
            }
          ]);
          
        if (profileError) {
          console.warn('Profile creation during signup failed:', profileError);
          // Don't throw - the trigger might have handled it or we'll handle it on first sign in
        } else {
          console.log('User profile created during signup with role:', role);
        }
      } catch (profileError) {
        console.warn('Profile creation during signup failed:', profileError);
        // Don't throw - we'll handle this on first sign in
      }
    }
    
    console.log('Sign up successful');
  };

  const signOut = async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    
    setUser(null);
    setSession(null);
    console.log('Sign out successful');
  };

  // Role checking functions with better logging
  const hasRole = (role: UserRole): boolean => {
    const result = user?.role === role;
    console.debug(`hasRole(${role}):`, result, `(current role: ${user?.role})`);
    return result;
  };
  
  const hasAnyRole = (roles: UserRole[]): boolean => {
    const result = user?.role ? roles.includes(user.role) : false;
    console.debug(`hasAnyRole([${roles.join(', ')}]):`, result, `(current role: ${user?.role})`);
    return result;
  };
  
  const isAdministrator = (): boolean => hasRole('administrator');
  const isFarmUser = (): boolean => hasRole('farm');
  const isCustomer = (): boolean => hasRole('customer');

  // Debug info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth state update:', {
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        } : null,
        loading,
        session: session ? 'Present' : 'None'
      });
    }
  }, [user, loading, session]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      hasRole,
      hasAnyRole,
      isAdministrator,
      isFarmUser,
      isCustomer,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}