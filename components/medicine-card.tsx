'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, Check, AlertCircle, FileText, Star } from 'lucide-react';
import { Medicine, generateWhatsAppMessage, openWhatsApp, getStock, needsPrescription, getAvailability } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

type Props = {
  medicine: Medicine;
};

export default function MedicineCard({ medicine }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some(i => i.medicine.id === medicine.id);
  const stock = getStock(medicine);
  const outOfStock = stock === 0;
  const lowStock = stock > 0 && stock <= 10;
  const rx = needsPrescription(medicine);
  const availability = getAvailability(medicine);
  const rating = medicine.rating;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(medicine);
    setAdded(true);
    toast.success(`${medicine.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const msg = generateWhatsAppMessage([{ id: medicine.id, medicine, quantity: 1 }]);
    openWhatsApp(msg);
  };

  return (
    <Link href={`/medicines/${medicine.id}`} className="medicine-card group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700/50 h-44">
        <img
          src={medicine.image_url}
          alt={medicine.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {medicine.discount_percent > 0 && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {medicine.discount_percent}% OFF
            </span>
          )}
          {rx && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <FileText size={9} /> Rx
            </span>
          )}
          {medicine.featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold text-sm px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {lowStock && !outOfStock && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle size={10} /> Only {stock} left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-0.5">
          {medicine.category && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">{medicine.category}</span>
          )}
          {rating && (
            <span className="ml-auto flex items-center gap-0.5 text-xs text-yellow-600 dark:text-yellow-400">
              <Star size={10} className="fill-yellow-400 text-yellow-400" /> {rating}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{medicine.brand}</p>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-0.5 line-clamp-1">
          {medicine.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{medicine.unit}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">₹{medicine.price.toFixed(2)}</span>
          {medicine.mrp > medicine.price && (
            <span className="text-sm text-gray-400 line-through">₹{medicine.mrp.toFixed(2)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              outOfStock
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : added || inCart
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md active:scale-95'
            }`}
          >
            {added || inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? 'Added!' : inCart ? 'In Cart' : 'Add'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-2.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-xl transition-all active:scale-95"
            title="Order via WhatsApp"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
