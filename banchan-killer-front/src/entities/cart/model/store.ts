import { create } from 'zustand';
import type { Product } from '@/entities/product/model/types';
import { apiClient } from '@/shared/api/base';

export interface CartItem {
  id: number;          // cart_items.id (DB PK)
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  status: string;
  stockQuantity: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedProductIds: number[];
  loading: boolean;

  // API 기반 액션
  fetchCart: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // 로컬 전용 액션 (선택 관리)
  toggleSelect: (productId: number) => void;
  toggleSelectAll: () => void;
  getSelectedItems: () => CartItem[];
  clearSelection: () => void;
  removeSelectedItems: () => void;
  getItemCount: () => number;
  getTotalCount: () => number;
  getTotalPrice: () => number;
  getSelectedTotalPrice: () => number;
}

// API 응답 → CartItem 매핑
function mapResponse(item: Record<string, unknown>): CartItem {
  return {
    id: item.id as number,
    productId: item.productId as number,
    name: item.productName as string,
    description: item.description as string || '',
    price: item.price as number,
    imageUrl: item.imageUrl as string || '',
    category: item.category as string,
    status: item.status as string,
    stockQuantity: item.stockQuantity as number,
    quantity: item.quantity as number,
  };
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  selectedProductIds: [],
  loading: false,

  fetchCart: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await apiClient.get('/cart');
      set({ items: data.map(mapResponse) });
    } catch {
      // 비로그인이면 빈 배열 유지
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (product) => {
    try {
      await apiClient.post('/cart', { productId: product.id, quantity: 1 });
      await get().fetchCart();
    } catch {
      // ignore
    }
  },

  removeItem: async (cartItemId) => {
    try {
      await apiClient.delete(`/cart/${cartItemId}`);
      set((state) => ({
        items: state.items.filter((item) => item.id !== cartItemId),
        selectedProductIds: state.selectedProductIds.filter(
          (pid) => !state.items.some((item) => item.id === cartItemId && item.productId === pid)
        ),
      }));
    } catch {
      // ignore
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    if (quantity < 1) {
      await get().removeItem(cartItemId);
      return;
    }
    try {
      await apiClient.patch(`/cart/${cartItemId}`, { quantity });
      set((state) => ({
        items: state.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        ),
      }));
    } catch {
      // ignore
    }
  },

  clearCart: async () => {
    try {
      await apiClient.delete('/cart');
      set({ items: [], selectedProductIds: [] });
    } catch {
      // ignore
    }
  },

  // 로컬 선택 관리 (DB 불필요)
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

  getItemCount: () => get().items.length,

  getTotalCount: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getSelectedTotalPrice: () =>
    get()
      .items.filter((item) => get().selectedProductIds.includes(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0),
}));
