'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, Search, Menu, X, Phone, Sun, Moon,
  User, LogOut, Settings, ChevronDown, Shield
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { Medicine } from '@/lib/data';
import { searchMedicines, toMedicine } from '@/lib/supabase';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchLoading(true);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await searchMedicines(searchQuery);
          setSearchResults(results.map(toMedicine).slice(0, 5));
        } catch {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery]);

  const handleSearchSelect = (id: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    router.push(`/medicines/${id}`);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md'
        : 'bg-white dark:bg-gray-900'
    }`}>
      {/* Top bar */}
      <div className="bg-green-700 dark:bg-green-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Phone size={10} /> Emergency: +91 9999 999 999
          </span>
          <span className="hidden sm:block">Free delivery on orders above ₹499</span>
          <span>Mon-Sat 8AM-10PM</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-green-700 dark:text-green-400 font-bold text-xl leading-none">Medi</span>
              <span className="text-gray-800 dark:text-white font-bold text-xl leading-none">Shop</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, brands, health products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                {searchResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSearchSelect(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.generic_name} {m.category && `· ${m.category}`}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600 shrink-0">₹{m.price}</span>
                  </button>
                ))}
                <Link
                  href={`/medicines?q=${searchQuery}`}
                  className="block px-4 py-3 text-center text-sm text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 font-medium border-t border-gray-100 dark:border-gray-700"
                  onClick={() => setSearchQuery('')}
                >
                  See all results for "{searchQuery}"
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/medicines" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Medicines
            </Link>
            <Link href="/prescription" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Upload Rx
            </Link>
            <Link href="/offers" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Offers
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                    <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors">
                        <Shield size={15} className="text-green-600" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md">
                <User size={15} /> Login
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden pb-3 relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                {searchResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSearchSelect(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <p className="text-sm font-medium">{m.name}</p>
                    <span className="ml-auto text-sm font-semibold text-green-600">₹{m.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4 space-y-1 animate-fade-in">
            <Link href="/medicines" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl">Medicines</Link>
            <Link href="/prescription" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl">Upload Prescription</Link>
            <Link href="/offers" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl">Offers</Link>
            {!user && (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl">Login / Register</Link>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 rounded-xl">Admin Dashboard</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
