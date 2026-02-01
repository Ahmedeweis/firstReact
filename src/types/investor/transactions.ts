import type { IDateValue } from '../common';
// Transaction Enums
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

export enum SortByField {
  CreatedAt = 'created_at',
  Amount = 'amount',
  Type = 'type',
  Status = 'status',
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

// Transaction Model
export interface Transaction {
  id: string; // or number if your API returns it as a number
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  created_at: IDateValue;
}

// Meta Information
export interface TransactionListMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

// Transaction List API Response
export interface TransactionListResponse {
  success: boolean;
  msg: string;
  data: Transaction[];
  meta: TransactionListMeta;
}

// Query Filter Parameters
export interface TransactionFilterQuery {
  page?: number;
  per_page?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  start_date?: IDateValue; // Format: YYYY-MM-DD
  end_date?: IDateValue; // Format: YYYY-MM-DD
  min_amount?: string;
  max_amount?: string;
  sort_by?: SortByField;
  sort_direction?: SortDirection;
}
