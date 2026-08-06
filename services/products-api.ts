import { fetch } from 'expo/fetch';

import type { Product } from '@/types/product';
import type { ProductCreateInput } from '@/contexts/products-context';
import { LOCAL_EASTER_EGG_PRODUCT_IDS } from '@/constants/local-easter-eggs';
import fallbackProducts from '@/products.json';

export const CLOUD_API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://119.59.102.161:3037'
).replace(/\/$/, '');

export const CLOUD_PRODUCTS_URL = `${CLOUD_API_URL}/api/products`;
export const PRODUCTS_URL = CLOUD_PRODUCTS_URL;

export type ProductsRemoteSource = 'cloud' | 'fallback';

const BLOCKED_PRODUCT_IDS = new Set(['39', '41', '42', '50', ...LOCAL_EASTER_EGG_PRODUCT_IDS]);
const BLOCKED_PRODUCT_NAMES = new Set([
  'ho-oh legend full',
  'lucario vstar',
  'origin palkia vstar',
  'chien-pao ex alt art',
]);
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.stock === 'number' &&
    Number.isFinite(value.stock) &&
    typeof value.stock_text === 'string' &&
    typeof value.category === 'string' &&
    typeof value.location_count === 'number' &&
    Number.isFinite(value.location_count) &&
    typeof value.location_text === 'string' &&
    (value.badge_status === 'Active' || value.badge_status === 'Low in stock') &&
    typeof value.image_url === 'string'
  );
}

export function isProducts(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

function dedupeProducts(products: Product[]): Product[] {
  const seenUrls = new Set<string>();
  const seenNames = new Set<string>();

  return products.filter((product) => {
    const idKey = product.id.trim();
    const urlKey = product.image_url.trim().toLowerCase();
    const nameKey = product.name.trim().toLowerCase();

    if (BLOCKED_PRODUCT_IDS.has(idKey) || BLOCKED_PRODUCT_NAMES.has(nameKey)) {
      return false;
    }

    if (seenUrls.has(urlKey) || seenNames.has(nameKey)) {
      return false;
    }

    seenUrls.add(urlKey);
    seenNames.add(nameKey);
    return true;
  });
}

async function fetchProductsFrom(url: string, sourceName: string): Promise<Product[]> {
  const response = await fetch(`${url}?refresh=${Date.now()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`โหลดสินค้าจาก ${sourceName} ไม่สำเร็จ (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!isProducts(data)) {
    throw new Error(`รูปแบบ products.json จาก ${sourceName} ไม่ถูกต้อง`);
  }

  return dedupeProducts(data);
}

export async function fetchProducts(): Promise<{
  products: Product[];
  source: ProductsRemoteSource;
}> {
  try {
    const products = await fetchProductsFrom(CLOUD_PRODUCTS_URL, 'Cloud API');
    return { products, source: 'cloud' };
  } catch {
    if (!isProducts(fallbackProducts)) {
      throw new Error('Local products.json is not valid');
    }

    return { products: dedupeProducts(fallbackProducts), source: 'fallback' };
  }
}

function getApiErrorMessage(data: unknown, fallback: string) {
  if (isRecord(data)) {
    const baseMessage = typeof data.error === 'string'
      ? data.error
      : typeof data.message === 'string'
        ? data.message
        : fallback;

    if (Array.isArray(data.details)) {
      const details = data.details
        .map((detail) => {
          if (!isRecord(detail)) {
            return null;
          }

          const field = typeof detail.field === 'string' && detail.field.length > 0
            ? detail.field
            : 'field';
          const message = typeof detail.message === 'string' ? detail.message : null;
          return message ? `${field}: ${message}` : null;
        })
        .filter((detail): detail is string => Boolean(detail));

      if (details.length > 0) {
        return `${baseMessage}: ${details.join(', ')}`;
      }
    }

    return baseMessage;
  }

  return fallback;
}

export async function createProduct(input: ProductCreateInput, token: string): Promise<Product> {
  const response = await fetch(CLOUD_PRODUCTS_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, `Create product failed (${response.status})`));
  }

  if (!isProduct(data)) {
    throw new Error('Cloud API returned an invalid product shape');
  }

  return data;
}

export async function updateProduct(id: string, input: Partial<ProductCreateInput>, token: string): Promise<Product> {
  const response = await fetch(`${CLOUD_PRODUCTS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, `Update product failed (${response.status})`));
  }

  if (!isProduct(data)) {
    throw new Error('Cloud API returned an invalid product shape');
  }

  return data;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${CLOUD_PRODUCTS_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new Error(getApiErrorMessage(data, `Delete product failed (${response.status})`));
  }
}
