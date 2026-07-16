export type ProductBadgeStatus = 'Active' | 'Low in stock';

export type Product = {
  id: string;
  name: string;
  stock: number;
  stock_text: string;
  category: string;
  location_count: number;
  location_text: string;
  badge_status: ProductBadgeStatus;
  image_url: string;
};
