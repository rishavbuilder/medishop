'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

function LoginPageContent() {
  const { user, signIn, loading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const redirectParam = searchParams.get('redirect') || '';

  console.log('[Login] Render - loading:', loading, 'user:', user?.email, 'isAdmin:', isAdmin);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  // Already logged in - show continue button
  if (user) {
    const handleContinue = () => {
      console.log('[Login] BUTTON CLICKED - navigate to admin');
      const target = isAdmin ? '/admin' : '/';
      console.log('[Login] Target:', target);
      router.push(target);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Signed In</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
          <button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Continue to {isAdmin ? 'Dashboard' : 'Store'}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: authError } = await signIn(form.email, form.password);

    if (authError) {
      setSubmitting(false);
      setError(authError.includes('Invalid') ? 'Invalid email or password.' : authError);
      return;
    }

    toast.success('Welcome back!');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-400 font-bold text-2xl">Medi</span>
              <span className="text-gray-800 dark:text-white font-bold text-2xl">Shop</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null); }}
                  type="email"
                  placeholder="admin2435@gmail.com"
                  required
                  className="input-field pl-10"
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null); }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  required
                  className="input-field pl-10 pr-10"
                  disabled={submitting}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50">
              {submitting ? <><Loader size={18} className="animate-spin" /> Signing in...</> : <><span>Sign In</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-green-600 dark:text-green-400 font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader size={32} className="animate-spin text-green-600" /></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
