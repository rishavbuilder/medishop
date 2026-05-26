'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">Welcome! The dashboard is working correctly.</p>
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <p className="text-green-700 dark:text-green-400 text-sm">Authentication successful. You are logged in as admin.</p>
      </div>
    </div>
  );
}
