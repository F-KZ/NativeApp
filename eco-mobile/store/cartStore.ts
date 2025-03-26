import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],

  addProduct: (product: any) =>
    // TODO: if already is cart, increase quantity, else, add a new item
    set((state: { items: any; }) => ({
      items: [...state.items, { product, quantity: 1 }],
    })),

  removeProduct: (productId: number) =>
    set((state: { items: any; }) => ({
      items: state.items.filter((item: any) => item.product.id !== productId),
    })),

  likeProduct: (productId: number) =>
    set((state: { items: any; }) => ({
      items: state.items.map((item: any) => item.product.id === productId ? { ...item, liked: !item.liked } : item),
    })),

  totalCart: (items: any) =>
    items.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0),

  resetCart: () => set({ items: [] }),
}));