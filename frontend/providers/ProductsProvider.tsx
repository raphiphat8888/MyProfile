import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { ProductsContext, type ProductsSource } from '@/contexts/products-context';
import {
  createProduct as createProductOnApi,
  deleteProduct as deleteProductOnApi,
  fetchProducts,
  updateProduct as updateProductOnApi,
} from '@/services/products-api';
import type { Product } from '@/types/product';
import type { ProductCreateInput } from '@/contexts/products-context';

export function ProductsProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProductsSource>('fallback');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchProducts();
      setProducts(result.products);
      setSource(result.source);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'โหลดสินค้าข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createProduct = useCallback(async (input: ProductCreateInput, token: string) => {
    const product = await createProductOnApi(input, token);
    setProducts((current) => [product, ...current]);
    setSource('cloud');
    return product;
  }, []);

  const updateProduct = useCallback(async (id: string, input: Partial<ProductCreateInput>, token: string) => {
    const product = await updateProductOnApi(id, input, token);
    setProducts((current) => current.map((item) => (item.id === id ? product : item)));
    setSource('cloud');
    return product;
  }, []);

  const deleteProduct = useCallback(async (id: string, token: string) => {
    await deleteProductOnApi(id, token);
    setProducts((current) => current.filter((item) => item.id !== id));
    setSource('cloud');
  }, []);

  const value = useMemo(
    () => ({ products, loading, error, source, refresh, createProduct, updateProduct, deleteProduct }),
    [createProduct, deleteProduct, error, loading, products, refresh, source, updateProduct],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
