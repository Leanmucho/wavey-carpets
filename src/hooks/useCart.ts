import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveCart = (newCart: Product[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product: Product) => {
    saveCart([...cart, product]);
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    saveCart([]);
  };

  return { cart, addToCart, removeFromCart, clearCart };
};
