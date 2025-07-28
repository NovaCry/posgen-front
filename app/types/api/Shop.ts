import type User from './User';
import type Sell from './Sell';
// import Order from "./Order";
import type Admission from './Admission';
import type { Product } from './Product';
import type { Category } from './Category';
import type Table from './Table';
import type { Discount } from './Discount';
import type MonthlyAnalytics from './MonthlyAnalytics';
import type Customer from './Customer';
import type { Tax } from './Tax';
import type { ShopSubscription } from './Subscription';

export default interface Shop {
  // Meta
  id: string;
  name: string;
  isSuspended: boolean;

  // Content
  sells?: Sell[];
  // orders?: Order[];
  admissions?: Admission[];
  products?: Product[];
  categories?: Category[];
  tables?: Table[];
  discounts?: Discount[];

  analytics?: MonthlyAnalytics[];

  // Relational
  owner?: User;
  ownerId: string;

  employees?: User[];

  openingTime: string;
  closingTime: string;
  Customer?: Customer[];

  Tax: Tax[];

  currentProductCount: number;
  currentEmployeeCount: number;
  currentMonthlySales: number;

  subscription?: ShopSubscription;
  shopSubscriptionId: string;
}
