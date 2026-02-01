import type { IDateValue } from '../common';

// Contact Us Model
export interface InvestorContactUs {
  id: number;
  subject: string;
  message: string;
  created_at: IDateValue;
  updated_at: IDateValue;
}

// Meta Information
export interface InvestorContactUsMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

// API Response
export interface InvestorContactUsListResponse {
  success: boolean;
  msg: string;
  data: InvestorContactUs[];
  meta: InvestorContactUsMeta;
}

// Form used for sending a new contact message
export type IContactUsForm = {
  subject: string;
  message: string;
};

// Standard response structure for contact-us operations
export type IContactUsBaseResponse = {
  success: boolean;
  msg: string;
};

// Single contact-us item (used in list or view)
export type IContactUsItem = {
  id: number;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
};

// Response structure for listing contact-us messages with pagination metadata
export type IContactUsListResponse = IContactUsBaseResponse & {
  data: IContactUsItem[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

// Response structure for fetching a single contact-us message
export type IContactUsSingleResponse = IContactUsBaseResponse & {
  data?: IContactUsItem;
};
