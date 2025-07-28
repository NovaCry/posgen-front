import type Shop from './Shop';

export default interface MonthlyAnalytics {
  // Meta
  id: string;
  startDate: string;

  // History
  dailySells: number[];
  dailyIncomes: number[];

  // Aggregated Monthly Metrics
  totalSales: number; // Total number of sales in the month
  totalIncome: number; // Total income in the month
  totalOrders: number; // Total number of orders in the month
  avgOrderValue: number; // Average order value for the month

  // Relational
  shop?: Shop;
  shopId: string;
}
