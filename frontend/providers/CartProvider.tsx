import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { CartContext, type CartQuantities } from '@/contexts/cart-context';

export function CartProvider({ children }: PropsWithChildren) {
  const [quantities, setQuantities] = useState<CartQuantities>({});

  const addToCart = useCallback((productId: string, quantity = 1) => {
    if (quantity <= 0) return;
    setQuantities((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + quantity,
    }));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((current) => {
      if (quantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }

      return { ...current, [productId]: quantity };
    });
  }, []);

  const clearCart = useCallback(() => setQuantities({}), []);
  const totalItems = useMemo(() => Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0), [quantities]);

  const value = useMemo(
    () => ({ quantities, totalItems, addToCart, setQuantity, clearCart }),
    [addToCart, clearCart, quantities, setQuantity, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
