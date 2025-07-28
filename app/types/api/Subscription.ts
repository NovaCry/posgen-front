export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  billingInterval: BillingInterval;
  maxProducts: number | null;
  maxMonthlySales: number | null;
  maxEmployees: number | null;
  maxShops: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopSubscription {
  id: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  autoRenew: boolean;
  paymentMethodId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type BillingInterval = 'MONTHLY' | 'ANNUAL';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'PENDING';
