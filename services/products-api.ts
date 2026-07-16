import { fetch } from 'expo/fetch';

import type { Product } from '@/types/product';

export const PRODUCTS_URL =
  'https://raw.githubusercontent.com/raphiphat8888/MyProfile/master/products.json';

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

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${PRODUCTS_URL}?refresh=${Date.now()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`โหลดสินค้าจาก GitHub ไม่สำเร็จ (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!isProducts(data)) {
    throw new Error('รูปแบบ products.json จาก GitHub ไม่ถูกต้อง');
  }

  return data;
}
