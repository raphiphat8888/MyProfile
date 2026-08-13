import type { Product } from '@/types/product';

export const LOCAL_EASTER_EGG_PRODUCT_IDS = new Set(['999']);

export const LOCAL_EASTER_EGG_PRODUCTS: Record<string, Product> = {
  '999': {
    id: '999',
    name: 'Taktจัง VMAX Gold Secret Rare',
    price: 9999,
    stock: 1,
    stock_text: 'Local easter egg',
    category: 'Ultra Secret Rare',
    location_count: 0,
    location_text: 'Not in Cloud MySQL',
    badge_status: 'Low in stock',
    image_url: 'special-taktjing-vmax-front',
  },
};
