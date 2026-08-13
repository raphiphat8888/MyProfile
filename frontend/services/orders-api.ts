import { fetch } from 'expo/fetch';

import { CLOUD_API_URL } from '@/services/products-api';

export type OrderItemInput = {
  product_id: number;
  quantity: number;
};

export type CreatedOrder = {
  id: string;
  status: string;
  total_amount: number;
};

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null) {
    if ('error' in data && typeof data.error === 'string') {
      return data.error;
    }
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return fallback;
}

function isCreatedOrder(value: unknown): value is CreatedOrder {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'status' in value &&
    typeof value.status === 'string' &&
    'total_amount' in value &&
    typeof value.total_amount === 'number'
  );
}

export async function createOrder(
  token: string,
  items: OrderItemInput[],
  shippingAddress = '',
): Promise<CreatedOrder> {
  const response = await fetch(`${CLOUD_API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items,
      shipping_address: shippingAddress,
    }),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Create order failed (${response.status})`));
  }

  if (!isCreatedOrder(data)) {
    throw new Error('Cloud API returned an invalid order shape');
  }

  return data;
}
