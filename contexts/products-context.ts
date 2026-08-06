import { createContext } from 'react';

import type { Product } from '@/types/product';

export type ProductsSource = 'cloud' | 'fallback';

export type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: ProductsSource;
  refresh: () => Promise<void>;
  createProduct: (input: ProductCreateInput, token: string) => Promise<Product>;
  updateProduct: (id: string, input: Partial<ProductCreateInput>, token: string) => Promise<Product>;
  deleteProduct: (id: string, token: string) => Promise<void>;
};

export type ProductCreateInput = {
  name: string;
  stock: number;
  category: string;
  location_count: number;
  image_url: string;
  description?: string;
  price?: number;
};

export const ProductsContext = createContext<ProductsContextValue | null>(null);
