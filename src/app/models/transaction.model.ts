export interface Transaction {
  id?: string;
  userId?: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
  recurrencePeriod?: 'monthly' | 'yearly';
  endDate?: string | null;
}
