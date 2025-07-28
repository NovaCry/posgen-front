import type { Product } from './Product';

export interface Stock {
  id: string;
  product: Product;
  productId: string;
  barcode: string;
  quantity: string;
  maxQuantity: string;
  createdAt: string;
}
