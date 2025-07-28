import type Shop from './Shop';

export default interface Sell {
  // Meta
  id: string;
  shop?: Shop;
  shopId: string;
  totalPrice: number;

  // Content
  products: Record<string, string>;

  // Default Meta
  createdAt: string;

  paymentMethod: string;
  deliveryType: string; // Teslimat türü (Elden, Uzaktan)
  receipt?: object; // Fiş bilgisi (obje)
}
