import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: item =>
    set(state => {
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        return state;
      }
      return { items: [...state.items, item] };
    }),
  removeItem: itemId =>
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
    })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price, 0);
  },
  getItemCount: () => {
    const { items } = get();
    return items.length;
  },
}));
