import { fetch } from 'expo/fetch';

import type { Product } from '@/types/product';

export const CLOUD_API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://119.59.102.161:3037'
).replace(/\/$/, '');

export const CLOUD_PRODUCTS_URL = `${CLOUD_API_URL}/api/products`;
export const GITHUB_PRODUCTS_URL =
  'https://raw.githubusercontent.com/raphiphat8888/MyProfile/master/products.json';
export const PRODUCTS_URL = GITHUB_PRODUCTS_URL;

export type ProductsRemoteSource = 'cloud' | 'github';

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
    const urlKey = product.image_url.trim().toLowerCase();
    const nameKey = product.name.trim().toLowerCase();

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
  // ข้าม Cloud API ถ้าไม่ได้ตั้งค่า EXPO_PUBLIC_API_URL ไว้
  // เพื่อหลีกเลี่ยง ERR_CONNECTION_REFUSED ที่ทำให้แอปช้า
  if (process.env.EXPO_PUBLIC_API_URL) {
    try {
      const products = await fetchProductsFrom(CLOUD_PRODUCTS_URL, 'Cloud API');
      return { products, source: 'cloud' };
    } catch {
      // Cloud API ไม่พร้อมใช้งาน → ใช้ GitHub แทน
      console.warn('[products-api] Cloud API ไม่พร้อม ใช้ GitHub แทน');
    }
  }

  // ใช้ GitHub เป็น primary source (ไม่มี EXPO_PUBLIC_API_URL หรือ Cloud ล้มเหลว)
  const products = await fetchProductsFrom(GITHUB_PRODUCTS_URL, 'GitHub');
  return { products, source: 'github' };
}
