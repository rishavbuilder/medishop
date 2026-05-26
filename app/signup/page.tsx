'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function SignupPage() {
  const { user, signUp, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && !created) {
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
    }
  }, [user, loading, isAdmin, router, created]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      const { error: authError } = await signUp(form.email, form.password, form.name);
      if (authError) {
        if (authError.includes('already registered')) {
          setError('This email is already registered. Try signing in instead.');
        } else {
          setError(authError);
        }
        return;
      }
      toast.success('Account created successfully!');
      setCreated(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (user && !created) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (created) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-10 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Welcome to MediShop. You can now browse medicines, upload prescriptions, and place orders.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-primary w-full text-center">
              Start Shopping
            </Link>
            <Link href="/login" className="w-full py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
              Sign In
            </Link>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Join MediShop for a better health experience
          </p>
        </div>

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(null); }}
                  type="text"
                  placeholder="Your full name"
                  required
                  className="input-field pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pl-10 pr-10"
                  autoComplete="new-password"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={form.confirmPassword}
                  onChange={e => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setError(null); }}
                  type="password"
                  placeholder="Re-enter your password"
                  required
                  className="input-field pl-10"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting
                ? <><Loader size={18} className="animate-spin" /> Creating account...</>
                : <><>Create Account</> <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                Sign in
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
