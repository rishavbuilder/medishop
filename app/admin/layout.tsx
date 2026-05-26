'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import AdminSidebar from '@/components/admin-sidebar';
import { Loader, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // After hydration and when auth is not loading
    if (hydrated && !loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, loading, user, router, pathname]);

  // During SSR or initial hydration, show nothing to prevent hydration mismatch
  if (!hydrated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - will redirect via useEffect
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access denied</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You don't have admin privileges to access this area.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Store <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Logged in as admin - show dashboard
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
