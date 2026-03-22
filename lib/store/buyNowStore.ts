import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BuyNowItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

interface BuyNowStore {
  item: BuyNowItem | null;
  setItem: (item: Omit<BuyNowItem, "quantity"> & { quantity?: number }) => void;
  clearItem: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useBuyNowStore = create<BuyNowStore>()(
  persist(
    (set, get) => ({
      item: null,

      setItem: (item) => {
        set({
          item: { ...item, quantity: item.quantity || 1 },
        });
      },

      clearItem: () => {
        set({ item: null });
      },

      getTotalPrice: () => {
        const item = get().item;
        if (!item) return 0;
        return item.price * item.quantity;
      },

      getTotalItems: () => {
        const item = get().item;
        if (!item) return 0;
        return item.quantity;
      },
    }),
    {
      name: "buy-now-storage",
    },
  ),
);
