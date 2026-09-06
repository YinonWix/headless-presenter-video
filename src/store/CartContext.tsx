import { createContext, useContext, useMemo, useState } from "react";

/**
 * Shared demo cart state. Only the middle product (Røket-9) is a real product;
 * everything else on the site is presentation-only. Selected size + quantity are
 * carried from the Product page to the Cart page so the two views stay consistent.
 */

export const PRODUCT = {
  name: "Røket-9",
  price: 350,
  sizes: [8, 9, 10, 11] as const,
  defaultSize: 8,
};

type CartValue = {
  size: number;
  quantity: number;
  setSize: (s: number) => void;
  setQuantity: (q: number) => void;
  incQuantity: () => void;
  decQuantity: () => void;
  subtotal: number;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState<number>(PRODUCT.defaultSize);
  const [quantity, setQuantity] = useState<number>(1);

  const value = useMemo<CartValue>(() => {
    const clamp = (q: number) => Math.max(1, Math.min(99, q));
    return {
      size,
      quantity,
      setSize,
      setQuantity: (q) => setQuantity(clamp(q)),
      incQuantity: () => setQuantity((q) => clamp(q + 1)),
      decQuantity: () => setQuantity((q) => clamp(q - 1)),
      subtotal: quantity * PRODUCT.price,
    };
  }, [size, quantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
