import type { Discount } from './Discount';
import type { Product, ProductAttribute } from './Product';
import type Shop from './Shop';

export interface Category {
  // Meta
  id: string;
  name: string;
  icon: string;

  // Relational
  products?: Product[];

  shop?: Shop;
  shopId: string;
  Discount?: Discount;
  discountId?: string;
  CategoryAttribute: CategoryAttribute[];
}

export interface CategoryAttribute {
  id: string;
  name: string; // Özel alan adı (örnek: "Frekans", "Boy")
  type: string; // Veri tipi ("string", "number", "boolean", vb.)

  category: Category;
  categoryId: string;

  // Bu özel alanın ürünlerdeki değerleri
  productAttributes: ProductAttribute[];
}
