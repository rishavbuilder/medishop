'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import AdminSidebar from '@/components/admin-sidebar';
import { Loader, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AUTH_TIMEOUT_MS = 5000;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      setTimedOut(true);
    }, AUTH_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [loading]);

  // Loading state with timeout
  if (loading && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center p-8">
          <Loader size={32} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">User: {user?.email || 'Checking session...'}</p>
        </div>
      </div>
    );
  }

  // Timeout fallback
  if (loading && timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Timeout</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Authentication check is taking too long. This may be a network issue.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Check console for debug logs
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
            <Link href="/" className="btn-secondary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center p-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Please sign in to access the admin dashboard.
          </p>
          <Link href="/login?redirect=/admin" className="btn-primary inline-flex items-center gap-2">
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center p-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            You don't have admin privileges.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Logged in as: {user.email}
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Store <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Admin user - render dashboard
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
