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
    }, 8000);

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }
        
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
      
      console.log('Auth state changed:', event);
      
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

  const fetchUserProfile = async (authUser: User) => {
    console.log('Fetching profile for:', authUser.id);
    
    try {
      // First, try to get the user profile
      const { data, error } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        
        if (error.code === 'PGRST116') {
          // User doesn't exist, try to create
          console.log('Creating user profile...');
          await createUserProfile(authUser);
        } else if (error.message?.includes('permission denied') || error.code === '42501') {
          // RLS policy issue
          console.warn('RLS permission denied, using fallback');
          setUserWithFallback(authUser);
        } else {
          // Other error, use fallback
          setUserWithFallback(authUser);
        }
      } else {
        // Success
        console.log('Profile found:', data);
        setUser({
          ...authUser,
          role: data.role,
          full_name: data.full_name
        });
      }
    } catch (error) {
      console.error('Profile fetch failed:', error);
      setUserWithFallback(authUser);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: 'customer' as UserRole
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Profile creation failed:', error);
        setUserWithFallback(authUser);
      } else {
        console.log('Profile created successfully:', data);
        setUser({
          ...authUser,
          role: data.role,
          full_name: data.full_name
        });
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      setUserWithFallback(authUser);
    }
  };

  const setUserWithFallback = (authUser: User) => {
    console.log('Using fallback user data');
    setUser({
      ...authUser,
      role: 'customer',
      full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User'
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) throw error;

    // The trigger should handle profile creation, but we can try as backup
    if (data.user && data.session) {
      try {
        await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              role: role
            }
          ]);
      } catch (profileError) {
        console.warn('Profile creation during signup failed:', profileError);
        // Don't throw - the trigger might have handled it
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setSession(null);
  };

  const hasRole = (role: UserRole): boolean => user?.role === role;
  const hasAnyRole = (roles: UserRole[]): boolean => user?.role ? roles.includes(user.role) : false;
  const isAdministrator = (): boolean => hasRole('administrator');
  const isFarmUser = (): boolean => hasRole('farm');
  const isCustomer = (): boolean => hasRole('customer');

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
      isCustomer
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