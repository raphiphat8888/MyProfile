import { createContext } from 'react';

export type CartQuantities = Record<string, number>;

export type CartContextValue = {
  quantities: CartQuantities;
  totalItems: number;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);
