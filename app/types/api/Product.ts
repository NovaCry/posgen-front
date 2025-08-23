import type { Category, CategoryAttribute } from './Category';
import type { Discount } from './Discount';
import type Shop from './Shop';
import type { Stock } from './Stock';
import type { ProductTax } from './Tax';

export interface Product {
  currentStock: unknown;
  limitedStock: unknown;
  // Meta
  id: string;
  name: string;
  price: string;

  // Relational
  category?: Category;
  categoryId: string;

  shop?: Shop;
  shopId: string;
  Discount?: Discount;
  discountId?: string;

  // Stock relation
  stocks: Stock[];

  isPricePerUnit: boolean;
  pricePerUnit?: string;
  unitType?: string; // Örnek: "kg", "litre", "adet"
  
  // Stockless product flag
  isLimitless: boolean;

  taxes: ProductTax[];
  ProductAttribute: ProductAttribute[];
}

export interface ProductAttribute {
  id: string;
  categoryAttribute: CategoryAttribute;
  categoryAttributeId: string;

  product: Product;
  productId: string;

  value: string; // Değer, JSON olarak tutulabilir (örneğin {"value": 3.5, "unit": "GHz"})
}
