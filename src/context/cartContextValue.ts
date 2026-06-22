import { createContext } from "react";
import type { CartItem, Product } from "../types";

export interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (product: Product, quantity?: number) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
