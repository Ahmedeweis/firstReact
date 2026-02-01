import type { IDateValue } from '../common';

// Profit Request Model
export interface InvestorProfitRequest {
  id: number;
  amount: string;
  message: string;
  created_at: IDateValue;
}

// Meta Information
export interface InvestorProfitRequestMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

// API Response for listing profit requests
export interface InvestorProfitRequestListResponse {
  success: boolean;
  msg: string;
  data: InvestorProfitRequest[];
  meta: InvestorProfitRequestMeta;
}

// Form used for sending a new profit request
export type IProfitRequestForm = {
  amount: string;
  message: string;
};

// Standard response structure for profit request operations
export type IProfitRequestBaseResponse = {
  success: boolean;
  msg: string;
};

// Single profit request item (used in list or detail view)
export type IProfitRequestItem = {
  id: number;
  amount: string;
  message: string;
  created_at: string;
};

// Response structure for listing profit requests with pagination metadata
export type IProfitRequestListResponse = IProfitRequestBaseResponse & {
  data: IProfitRequestItem[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

// Response structure for fetching a single profit request
export type IProfitRequestSingleResponse = IProfitRequestBaseResponse & {
  data?: IProfitRequestItem;
};
