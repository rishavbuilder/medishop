'use client';

import React, { useState } from 'react';
import { FileText, Eye, Check, X, Clock } from 'lucide-react';

const PRESCRIPTIONS = [
  { id: 'RX-001', customer: 'Priya Sharma', phone: '+91 98765 43210', address: '123 MG Road, Mumbai', notes: 'Urgent - need same day delivery', status: 'pending', submitted: '2024-12-15 10:30 AM', fileType: 'image' },
  { id: 'RX-002', customer: 'Rajesh Kumar', phone: '+91 98765 12345', address: '45 Nehru Street, Delhi', notes: 'Monthly prescription for chronic condition', status: 'reviewed', submitted: '2024-12-14 3:15 PM', fileType: 'pdf' },
  { id: 'RX-003', customer: 'Anita Patel', phone: '+91 87654 32109', address: 'B-12 Baner, Pune', notes: '', status: 'approved', submitted: '2024-12-13 9:00 AM', fileType: 'image' },
  { id: 'RX-004', customer: 'Suresh Nair', phone: '+91 76543 21098', address: '78 Anna Salai, Chennai', notes: 'Prescription from specialist', status: 'rejected', submitted: '2024-12-12 11:45 AM', fileType: 'pdf' },
];

type RxStatus = 'pending' | 'reviewed' | 'approved' | 'rejected';

const STATUS_STYLES: Record<RxStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(PRESCRIPTIONS);
  const [selected, setSelected] = useState<typeof PRESCRIPTIONS[number] | null>(null);

  const update = (id: string, status: RxStatus) => {
    setPrescriptions(ps => ps.map(p => p.id === id ? { ...p, status } : p));
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {prescriptions.length} total · <span className="text-orange-600 dark:text-orange-400">{pendingCount} pending review</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {prescriptions.map(rx => (
            <div
              key={rx.id}
              onClick={() => setSelected(rx)}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md ${
                selected?.id === rx.id
                  ? 'border-green-500 ring-2 ring-green-500/20'
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rx.fileType === 'pdf' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                    <FileText size={18} className={rx.fileType === 'pdf' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{rx.customer}</p>
                    <p className="text-xs text-gray-400">{rx.id} · {rx.submitted}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_STYLES[rx.status as RxStatus]}`}>
                  {rx.status}
                </span>
              </div>
              {rx.notes && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  "{rx.notes}"
                </p>
              )}
            </div>
          ))}
        </div>

        {selected ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">Prescription Details</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[selected.status as RxStatus]}`}>{selected.status}</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <FileText size={40} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prescription {selected.fileType.toUpperCase()}</p>
                  <button className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium hover:underline">
                    View Full Size
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Customer</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selected.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selected.phone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">Address</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">{selected.address}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-sm text-gray-600 dark:text-gray-300">
                  <p className="text-xs text-gray-400 mb-1">Customer Notes:</p>
                  {selected.notes}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => update(selected.id, 'approved')}
                  disabled={selected.status === 'approved'}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selected.status === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  <Check size={15} /> Approve
                </button>
                <button
                  onClick={() => update(selected.id, 'rejected')}
                  disabled={selected.status === 'rejected'}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selected.status === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <X size={15} /> Reject
                </button>
                <button
                  onClick={() => update(selected.id, 'reviewed')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock size={15} /> Reviewed
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center h-64">
            <p className="text-gray-400 text-sm">Select a prescription to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
