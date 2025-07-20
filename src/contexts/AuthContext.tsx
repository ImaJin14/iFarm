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
  const [initComplete, setInitComplete] = useState(false);

  // Force loading to false after timeout to prevent infinite loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading && !initComplete) {
        console.warn('Auth initialization timed out, forcing loading to false');
        setLoading(false);
        setInitComplete(true);
      }
    }, 8000); // 8 second max loading time

    return () => clearTimeout(loadingTimeout);
  }, [loading, initComplete]);

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session check:', { session: !!session, error });
        
        if (error) {
          console.error('Error getting initial session:', error);
          // Clear any invalid stored tokens
          if (error.message?.includes('Invalid Refresh Token') || 
              error.message?.includes('refresh_token_not_found')) {
            console.log('Clearing invalid session...');
            await supabase.auth.signOut();
          }
          setLoading(false);
          setInitComplete(true);
          return;
        }
        
        setSession(session);
        if (session?.user) {
          console.log('Found existing session, fetching user profile...');
          await fetchUserProfile(session.user);
        } else {
          console.log('No existing session found');
          setLoading(false);
        }
        setInitComplete(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitComplete(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, { session: !!session });
      
      try {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          setSession(session);
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          console.log('User signed out or session ended');
          setUser(null);
          setSession(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, fetching profile...');
          setSession(session);
          await fetchUserProfile(session.user);
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated');
          setSession(session);
          await fetchUserProfile(session.user);
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        
        // Handle invalid refresh token errors
        if (error.message?.includes('Invalid Refresh Token') || 
            error.message?.includes('refresh_token_not_found') ||
            error.status === 400) {
          console.log('Invalid refresh token detected, signing out...');
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setSession(null);
            setLoading(false);
          }
        }
      }
    });

    return () => {
      mounted = false;
      console.log('AuthProvider cleanup');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    console.log('fetchUserProfile started for user:', authUser.id);
    
    const fetchTimeout = setTimeout(() => {
      console.warn('fetchUserProfile timed out, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout for profile fetch
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single();

      clearTimeout(fetchTimeout);

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user doesn't exist in users table, create a basic profile
        if (error.code === 'PGRST116') { // Row not found
          console.log('User profile not found, creating basic profile...');
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: authUser.id,
                  email: authUser.email!,
                  full_name: authUser.user_metadata?.full_name || null,
                  role: 'customer' as UserRole
                }
              ]);

            if (insertError) {
              console.error('Error creating user profile:', insertError);
            } else {
              console.log('Basic user profile created');
            }
          } catch (insertErr) {
            console.error('Failed to create user profile:', insertErr);
          }
        }
        
        // Set user with default values
        setUser({
          ...authUser,
          role: 'customer',
          full_name: authUser.user_metadata?.full_name || null
        });
      } else {
        console.log('User profile fetched successfully:', data);
        setUser({
          ...authUser,
          role: data.role,
          full_name: data.full_name
        });
      }
    } catch (error) {
      clearTimeout(fetchTimeout);
      console.error('Unexpected error in fetchUserProfile:', error);
      // Set user with basic info even if profile fetch fails
      setUser({
        ...authUser,
        role: 'customer',
        full_name: authUser.user_metadata?.full_name || null
      });
    } finally {
      console.log('fetchUserProfile completed, setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('signIn attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('SignIn error:', error);
        throw error;
      }

      console.log('SignIn successful:', { user: !!data.user, session: !!data.session });
      
      // The onAuthStateChange listener will handle setting the user
      return;
    } catch (error) {
      console.error('SignIn failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    console.log('signUp attempt for:', email, 'with role:', role);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        throw error;
      }

      console.log('SignUp result:', { user: !!data.user, session: !!data.session });

      if (data.user) {
        // Create user profile in the users table
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email!,
                full_name: fullName,
                role: role
              }
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't throw here - the user account was created successfully
          } else {
            console.log('User profile created successfully');
          }
        } catch (profileErr) {
          console.error('Failed to create user profile:', profileErr);
        }
      }
      
      return;
    } catch (error) {
      console.error('SignUp failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('signOut initiated');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SignOut error:', error);
        throw error;
      }
      
      console.log('SignOut successful');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('SignOut failed:', error);
      // Even if signOut fails, clear local state
      setUser(null);
      setSession(null);
      throw error;
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const isAdministrator = (): boolean => {
    return hasRole('administrator');
  };

  const isFarmUser = (): boolean => {
    return hasRole('farm');
  };

  const isCustomer = (): boolean => {
    return hasRole('customer');
  };

  const value = {
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
  };

  console.log('AuthProvider render:', { 
    user: !!user, 
    loading, 
    session: !!session,
    userRole: user?.role,
    initComplete 
  });

  return (
    <AuthContext.Provider value={value}>
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

export { AuthContext }