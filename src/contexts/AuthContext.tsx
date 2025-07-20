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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // Clear any invalid stored tokens
        if (error.message?.includes('Invalid Refresh Token') || error.message?.includes('refresh_token_not_found')) {
          supabase.auth.signOut();
        }
        setLoading(false);
        return;
      }
      
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      try {
        if (event === 'TOKEN_REFRESHED') {
          setSession(session);
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setSession(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
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
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(authUser as AuthUser);
      } else {
        setUser({
          ...authUser,
          role: data.role,
          full_name: data.full_name
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(authUser as AuthUser);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create user profile
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
          throw profileError;
        }
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
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