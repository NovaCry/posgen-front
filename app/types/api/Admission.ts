import type Shop from './Shop';
import type Table from './Table';

export default interface Admission {
  id: string;
  shop?: Shop;
  shopId: string;
  totalPrice: string;

  // Content
  products: string[];

  table?: Table;
  tableId: string;

  // Default Meta
  createdAt: string;
  status: AdmissionStatus;
}

export type AdmissionStatus = 'OPEN' | 'CLOSED';
