import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { ProductsContext, type ProductsSource } from '@/contexts/products-context';
import fallbackProducts from '@/products.json';
import { fetchProducts, isProducts } from '@/services/products-api';
import type { Product } from '@/types/product';

if (!isProducts(fallbackProducts)) {
  throw new Error('รูปแบบ products.json ในแอปไม่ถูกต้อง');
}

const initialProducts: Product[] = fallbackProducts;

export function ProductsProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProductsSource>('fallback');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
      setSource('github');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'โหลดสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ products, loading, error, source, refresh }),
    [error, loading, products, refresh, source],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
