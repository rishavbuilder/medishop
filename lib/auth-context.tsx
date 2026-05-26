'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

type UserRole = 'user' | 'admin';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('user');
  const initialized = useRef(false);

  // Fetch role once when user changes
  const fetchRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Error fetching role:', error);
        setRole('user');
        return;
      }
      console.log('[Auth] Role fetched:', data?.role);
      setRole((data?.role as UserRole) || 'user');
    } catch (err) {
      console.error('[Auth] Exception fetching role:', err);
      setRole('user');
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('[Auth] Initializing...');

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Auth] Get session error:', error);
        setLoading(false);
        return;
      }

      console.log('[Auth] Session:', session ? 'found' : 'not found');
      console.log('[Auth] User:', session?.user?.email);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchRole(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] State change:', event, session?.user?.email);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole('user');
      }
    });

    return () => {
      console.log('[Auth] Cleaning up');
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signIn = async (email: string, password: string) => {
    console.log('[Auth] Signing in:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] Sign in error:', error);
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('[Auth] Signing up:', email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('[Auth] Sign up error:', error);
      return { error: error.message };
    }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        role: 'user',
        is_admin: false,
      });
    }
    return { error: null };
  };

  const signOut = async () => {
    console.log('[Auth] Signing out');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole('user');
  };

  console.log('[Auth] Current state - user:', user?.email, 'role:', role, 'loading:', loading);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        isAdmin: role === 'admin',
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
