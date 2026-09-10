import { fetch } from 'expo/fetch';

import { CLOUD_API_URL } from '@/services/products-api';

export type SegmentationProduct = {
  product_id: string;
  product_name: string;
  price: number;
  category: string;
};

export async function fetchSegmentationProducts(token: string): Promise<SegmentationProduct[]> {
  const response = await fetch(`${CLOUD_API_URL}/api/products/segmentation-data`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(responseText);
  } catch {
    data = null;
  }
  if (!response.ok) {
    const serverMessage = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : responseText.trim();
    throw new Error(serverMessage || `Segmentation data request failed (${response.status}). Deploy the latest backend first.`);
  }
  if (!Array.isArray(data)) {
    throw new Error('Segmentation API returned an invalid product list.');
  }

  return data.filter((item): item is SegmentationProduct => {
    if (!item || typeof item !== 'object') return false;
    const row = item as Record<string, unknown>;
    return typeof row.product_id === 'string'
      && typeof row.product_name === 'string'
      && typeof row.price === 'number'
      && Number.isFinite(row.price);
  });
}