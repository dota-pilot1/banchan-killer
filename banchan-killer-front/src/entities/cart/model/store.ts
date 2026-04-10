import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/entities/product/model/types';

export interface CartItem {
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Product['category'];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedProductIds: number[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  toggleSelectAll: () => void;
  getSelectedItems: () => CartItem[];
  clearSelection: () => void;
  removeSelectedItems: () => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalCount: () => number;
  getTotalPrice: () => number;
  getSelectedTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedProductIds: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                quantity: 1,
              },
            ],
            selectedProductIds: state.selectedProductIds.includes(product.id)
              ? state.selectedProductIds
              : [...state.selectedProductIds, product.id],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
          selectedProductIds: state.selectedProductIds.filter((id) => id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      toggleSelect: (productId) =>
        set((state) => ({
          selectedProductIds: state.selectedProductIds.includes(productId)
            ? state.selectedProductIds.filter((id) => id !== productId)
            : [...state.selectedProductIds, productId],
        })),
      toggleSelectAll: () =>
        set((state) => ({
          selectedProductIds:
            state.selectedProductIds.length === state.items.length
              ? []
              : state.items.map((item) => item.productId),
        })),
      getSelectedItems: () =>
        get().items.filter((item) => get().selectedProductIds.includes(item.productId)),
      clearSelection: () => set({ selectedProductIds: [] }),
      removeSelectedItems: () => set((state) => ({
        items: state.items.filter((item) => !state.selectedProductIds.includes(item.productId)),
        selectedProductIds: [],
      })),
      clearCart: () => set({ items: [], selectedProductIds: [] }),
      getItemCount: () => get().items.length,
      getTotalCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getSelectedTotalPrice: () =>
        get()
          .items.filter((item) => get().selectedProductIds.includes(item.productId))
          .reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
