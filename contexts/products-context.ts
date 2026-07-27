import { createContext } from 'react';

import type { Product } from '@/types/product';

export type ProductsSource = 'cloud' | 'fallback' | 'github';

export type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: ProductsSource;
  refresh: () => Promise<void>;
};

export const ProductsContext = createContext<ProductsContextValue | null>(null);
