'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserRole(userId: string): Promise<UserRole> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    return (data?.role as UserRole) || 'user';
  } catch {
    return 'user';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('user');
  const [initialized, setInitialized] = useState(false);

  const refreshRole = useCallback(async () => {
    if (user) {
      const r = await fetchUserRole(user.id);
      setRole(r);
    } else {
      setRole('user');
    }
  }, [user]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const r = await fetchUserRole(session.user.id);
          setRole(r);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const r = await fetchUserRole(session.user.id);
        setRole(r);
      } else {
        setRole('user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setLoading(false);
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
      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole('user');
  };

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin, signIn, signUp, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
