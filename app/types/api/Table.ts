import type Admission from './Admission';
import type Shop from './Shop';

export default interface Table {
  id: string;
  name: string;
  seatSize: number;

  admissions?: Admission[];
  shop?: Shop;
  shopId: string;
}
