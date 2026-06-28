import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface FavoritesStore {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [...state.items, product],
          };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        })),
    }),
    { name: "tmall-favorites" }
  )
);
