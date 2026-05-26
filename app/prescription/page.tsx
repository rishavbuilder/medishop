'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, CheckCircle, X, Phone, MapPin, User, MessageSquare, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type FormData = {
  customerName: string;
  phone: string;
  address: string;
  notes: string;
};

export default function PrescriptionPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({ customerName: '', phone: '', address: '', notes: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB allowed.');
      return;
    }
    if (!f.type.match(/image|pdf/)) {
      toast.error('Only images and PDF files are allowed.');
      return;
    }
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please upload your prescription'); return; }
    if (!form.customerName || !form.phone || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // For demo, use a placeholder URL since storage bucket isn't set up
      const fileUrl = `prescription_${Date.now()}_${file.name}`;

      const { error } = await supabase.from('prescriptions').insert({
        user_id: user?.id || null,
        customer_name: form.customerName,
        customer_phone: form.phone,
        customer_address: form.address,
        file_url: fileUrl,
        file_type: file.type.startsWith('image/') ? 'image' : 'pdf',
        notes: form.notes,
        status: 'pending',
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-10 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Prescription Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            We've received your prescription. Our pharmacist will review it and contact you shortly.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-8">
            Expected response within 30 minutes
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/919999999999?text=I just uploaded a prescription. Can you confirm receipt?"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full flex items-center justify-center gap-2"
            >
              Follow up on WhatsApp
            </a>
            <button
              onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setForm({ customerName: '', phone: '', address: '', notes: '' }); }}
              className="w-full py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Upload Another Prescription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <FileText size={14} /> Prescription Upload
          </div>
          <h1 className="text-3xl font-bold mb-2">Upload Your Prescription</h1>
          <p className="text-white/80">Upload a clear photo or PDF of your prescription. Our pharmacist will verify and prepare your medicines.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { step: '1', title: 'Upload', desc: 'Photo or PDF of prescription' },
            { step: '2', title: 'Review', desc: 'Pharmacist verifies in 30 min' },
            { step: '3', title: 'Deliver', desc: 'Medicines at your door' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                {step}
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload size={18} className="text-green-600" /> Upload Prescription
            </h2>

            {!file ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                }`}
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Drop your file here or click to browse</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supports JPG, PNG, PDF up to 10MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="relative">
                {preview ? (
                  <img src={preview} alt="Prescription preview" className="w-full max-h-64 object-contain rounded-2xl border border-gray-200 dark:border-gray-600" />
                ) : (
                  <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <User size={18} className="text-green-600" /> Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="input-field pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    type="tel"
                    required
                    className="input-field pl-9"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <textarea
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Full delivery address with pincode"
                    required
                    rows={3}
                    className="input-field pl-9 resize-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Notes (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special instructions, preferred brands, or urgency..."
                    rows={3}
                    className="input-field pl-9 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg ${
              loading || !file
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl active:scale-95'
            }`}
          >
            {loading ? <><Loader size={20} className="animate-spin" /> Submitting...</> : <><Upload size={20} /> Submit Prescription</>}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By submitting, you agree to our terms. Your prescription is handled confidentially.
          </p>
        </form>
      </div>
    </div>
  );
}
