import type { IDateValue } from '../common';

export enum TransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
  Profit = 'profit',
}

export enum TransactionStatus {
  Completed = 'completed',
  Pending = 'pending',
  Failed = 'failed',
}

export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  created_at: IDateValue;
}

export interface OverviewData {
  balance: string;
  total_profits: string;
  recent_transactions: Transaction[];
}

export interface OverviewResponse {
  success: boolean;
  msg: string;
  data: OverviewData;
}
