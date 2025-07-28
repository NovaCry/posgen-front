export interface Billing {
  id: string;
  subscriptionId: string;
  amount: string;
  currency: string;
  billingDate: Date;
  dueDate: Date;
  status: string;
  invoiceId: string | null;
  paymentMethod: string | null;
  createdAt: Date;
}
