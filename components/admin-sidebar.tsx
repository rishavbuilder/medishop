'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Pill, ClipboardList, FileText,
  AlertTriangle, BarChart3, Settings, LogOut, Menu, X, Shield
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/medicines', icon: Pill, label: 'Medicines' },
  { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { href: '/admin/prescriptions', icon: FileText, label: 'Prescriptions' },
  { href: '/admin/stock', icon: AlertTriangle, label: 'Stock Alerts' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-900 dark:bg-gray-950 text-white flex flex-col z-50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <span className="text-green-400 font-bold">Medi</span>
                <span className="text-white font-bold">Shop</span>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-green-400" />
                  <p className="text-[10px] text-green-400">Admin Panel</p>
                </div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors shrink-0">
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-3">
          {!collapsed && user && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.email}</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <Shield size={8} /> {isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          )}
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
          >
            <Settings size={16} className="shrink-0" />
            {!collapsed && 'View Store'}
          </Link>
          <button
            onClick={signOut}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div className={`shrink-0 ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`} />
    </>
  );
}
