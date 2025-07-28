import type { Category } from './Category';
import type { Product } from './Product';
import type Shop from './Shop';

export interface Discount {
  // Meta
  id: string;
  name: string;
  discount: string;
  isRate: boolean;

  // Date
  createdAt: string;
  expiry?: string;

  // Uses
  uses: number;
  maxUses?: number;

  // Relational
  isRelated: boolean;
  relatedProducts?: Product[];
  relatedCategories?: Category[];

  shop?: Shop;
  shopId: string;
}
