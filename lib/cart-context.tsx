'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Medicine, CartItem } from './data';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; medicine: Medicine }
  | { type: 'REMOVE_ITEM'; medicineId: string }
  | { type: 'UPDATE_QUANTITY'; medicineId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

type CartContextType = {
  items: CartItem[];
  addItem: (medicine: Medicine) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.medicine.id === action.medicine.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.medicine.id === action.medicine.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { id: action.medicine.id, medicine: action.medicine, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.medicine.id !== action.medicineId) };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { items: state.items.filter(i => i.medicine.id !== action.medicineId) };
      }
      return {
        items: state.items.map(i =>
          i.medicine.id === action.medicineId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medishop-cart');
      if (saved) {
        dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('medishop-cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem: (medicine) => dispatch({ type: 'ADD_ITEM', medicine }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', medicineId: id }),
      updateQuantity: (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', medicineId: id, quantity: qty }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
