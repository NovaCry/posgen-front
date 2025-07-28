import type { Product } from './Product';
import type Shop from './Shop';

export interface Tax {
  id: string;
  name: string; // Vergi adı (KDV, ÖTV vb.)
  rate: string; // Vergi oranı (0.18 gibi)
  isIncluded: boolean; // Fiyata dahil mi?
  description?: string;
  shop: Shop;
  shopId: string;
  ProductTax: ProductTax[];
}

export interface ProductTax {
  id: string;
  product: Product;
  productId: string;
  tax: Tax;
  taxId: string;
}
