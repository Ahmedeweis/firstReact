import type { IProductApiItem } from 'src/types/product';
import { useState, useEffect, useCallback } from 'react';

import { getStorage, setStorage } from './use-local-storage';

// ----------------------------------------------------------------------

export type ICartItem = {
  id: number;
  product: IProductApiItem;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

const CART_STORAGE_KEY = 'product-cart';

// ----------------------------------------------------------------------

export function useCart() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getStorage(CART_STORAGE_KEY) as ICartItem[];
    if (savedCart && Array.isArray(savedCart)) {
      setCartItems(savedCart);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      setStorage(CART_STORAGE_KEY, cartItems);
    }
  }, [cartItems, isInitialized]);

  const addToCart = useCallback(
    (product: IProductApiItem, quantity: number = 1, color?: string, size?: string) => {
      setCartItems((prevItems) => {
        // Check if product already exists in cart
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedColor === color &&
            item.selectedSize === size
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          return updatedItems;
        }

        // Add new item to cart
        return [
          ...prevItems,
          {
            id: product.id,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: number, color?: string, size?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === itemId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (itemId: number, quantity: number, color?: string, size?: string) => {
      if (quantity <= 0) {
        removeFromCart(itemId, color, size);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setStorage(CART_STORAGE_KEY, []);
  }, []);

  const getCartItemCount = useCallback(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const getCartTotal = useCallback(() =>
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.product.sale_price || item.product.regular_price);
      return total + price * item.quantity;
    }, 0),
    [cartItems]);

  const isInCart = useCallback(
    (productId: number, color?: string, size?: string) =>
      cartItems.some(
        (item) =>
          item.id === productId && item.selectedColor === color && item.selectedSize === size
      ),
    [cartItems]
  );

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
  };
}

