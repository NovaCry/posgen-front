import type Admission from './Admission';
import type Shop from './Shop';

export default interface Table {
  id: string;
  name: string;
  seatSize: number;
  status?: string;
  hasActiveOrder?: boolean;
  hasActiveReservation?: boolean;

  admissions?: Admission[];
  shop?: Shop;
  shopId: string;
}
