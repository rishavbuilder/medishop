'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

function LoginForm() {
  const { user, signIn, loading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const redirectPath = searchParams.get('redirect') || '';
  const authError = searchParams.get('error');

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Redirect authenticated users
    if (hydrated && !loading && user) {
      if (isAdmin) {
        router.replace(redirectPath || '/admin');
      } else {
        router.replace('/');
      }
    }
  }, [hydrated, user, loading, isAdmin, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error: authError } = await signIn(form.email, form.password);
      if (authError) {
        setSubmitting(false);
        if (authError.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.includes('Email not confirmed')) {
          setError('Please confirm your email address first.');
        } else {
          setError(authError);
        }
        return;
      }
      toast.success('Welcome back!');
      // Navigation will happen via useEffect when user state updates
    } catch {
      setSubmitting(false);
      setError('Something went wrong. Please try again.');
    }
  };

  // Show loading during SSR or initial hydration
  if (!hydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-400 font-bold text-2xl leading-none">Medi</span>
              <span className="text-gray-800 dark:text-white font-bold text-2xl leading-none">Shop</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Sign in to track orders and upload prescriptions
          </p>
        </div>

        {/* Auth required message */}
        {authError === 'auth_required' && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
            <AlertCircle size={16} className="shrink-0" />
            Please sign in to access that page.
          </div>
        )}
        {authError === 'access_denied' && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            You don't have admin access. Please sign in with an admin account.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null); }}
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="input-field pl-10"
                  autoComplete="email"
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null); }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting
                ? <><Loader size={18} className="animate-spin" /> Signing in...</>
                : <><>Sign In</> <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Shield size={12} className="text-green-500" />
          <span>Your data is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
