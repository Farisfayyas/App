import { create } from 'zustand';
import { Item, CartItem } from '@/types';

interface CartStore {
  cartItems: CartItem[];
  likedItems: Item[];
  addToCart: (item: Item, size: string) => void;
  addToLikes: (item: Item) => void;
  removeFromCart: (cartItemId: string) => void;
  removeFromLikes: (itemId: string) => void;
  updateSize: (cartItemId: string, newSize: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartCount: () => number;
  cartTotal: () => number;
  isLiked: (itemId: string) => boolean;
  isInCart: (itemId: string) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  likedItems: [],

  addToCart: (item, size) => {
    const existing = get().cartItems.find(
      (ci) => ci.item.id === item.id && ci.selectedSize === size
    );
    if (existing) {
      // Increment quantity if the exact same item+size is already in cart
      set((state) => ({
        cartItems: state.cartItems.map((ci) =>
          ci.id === existing.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        ),
      }));
    } else {
      const newItem: CartItem = {
        id: `cart-${item.id}-${size}-${Date.now()}`,
        item,
        selectedSize: size,
        quantity: 1,
        addedAt: Date.now(),
      };
      set((state) => ({ cartItems: [...state.cartItems, newItem] }));
    }
  },

  addToLikes: (item) => {
    if (get().likedItems.some((i) => i.id === item.id)) return;
    set((state) => ({ likedItems: [...state.likedItems, item] }));
  },

  removeFromCart: (cartItemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((ci) => ci.id !== cartItemId),
    })),

  removeFromLikes: (itemId) =>
    set((state) => ({
      likedItems: state.likedItems.filter((i) => i.id !== itemId),
    })),

  updateSize: (cartItemId, newSize) =>
    set((state) => ({
      cartItems: state.cartItems.map((ci) =>
        ci.id === cartItemId ? { ...ci, selectedSize: newSize } : ci
      ),
    })),

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map((ci) =>
        ci.id === cartItemId ? { ...ci, quantity } : ci
      ),
    }));
  },

  cartCount: () => get().cartItems.reduce((sum, ci) => sum + ci.quantity, 0),

  cartTotal: () =>
    get().cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),

  isLiked: (itemId) => get().likedItems.some((i) => i.id === itemId),

  isInCart: (itemId) => get().cartItems.some((ci) => ci.item.id === itemId),
}));
