'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, FileText, ShoppingCart, User, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();

  if (pathname.startsWith('/admin')) return null;
  if (pathname === '/login' || pathname === '/signup') return null;

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/medicines', icon: Pill, label: 'Medicines' },
    { href: '/prescription', icon: FileText, label: 'Upload Rx' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart' },
    ...(user && isAdmin
      ? [{ href: '/admin', icon: Shield, label: 'Admin' }]
      : user
      ? [{ href: '/', icon: User, label: 'Account' }]
      : [{ href: '/login', icon: User, label: 'Login' }]
    ),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && href !== '/login' && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-3 min-w-0 relative transition-colors ${
                isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {label === 'Cart' && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-green-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-green-600 dark:text-green-400' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
