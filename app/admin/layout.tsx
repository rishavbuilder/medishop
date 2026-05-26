'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import AdminSidebar from '@/components/admin-sidebar';
import { Loader, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign in required</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You need to sign in to access the admin dashboard.
          </p>
          <Link
            href="/login?redirect=/admin"
            className="btn-primary inline-flex items-center gap-2"
          >
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access denied</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You don't have admin privileges to access this area. Contact your administrator if you believe this is an error.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Store <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
