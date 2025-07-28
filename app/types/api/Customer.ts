import type Shop from './Shop';

export default interface Customer {
  // Meta
  id: string;

  name: string;
  lastName: string;

  email: string;
  phone: string;

  location: number[];

  totalSells: number;
  totalIncome: number;

  createdAt: string;

  // Relational
  shop?: Shop;
  shopId: string;
}
