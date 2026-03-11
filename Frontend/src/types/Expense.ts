export interface Expense {
  id: number;
  date: string;
  amount: number;
  vendorName: string;
  description: string;
  category: string;
  isAnomaly: boolean;
}

export interface TopVendor {
  vendor: string;
  total: number;
}

export interface DashboardData {
  monthlyTotals: Record<string, number>;
  topVendors: TopVendor[];
  anomalies: Expense[];
}


