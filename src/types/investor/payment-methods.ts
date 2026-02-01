// Payment Method Enums
export enum PaymentMethodType {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Amex = 'amex',
}

// Payment Method Model
export interface PaymentMethod {
  id: number;
  name: string;
  card_number: string;
  expiry: string;
  cvc: string;
  type: PaymentMethodType;
}

// Create Payment Method Request
export interface CreatePaymentMethodRequest {
  type: PaymentMethodType;
  name: string;
  card_number?: string;
  expiry?: string;
  cvc?: string;
}

// Create Payment Method Response
export interface CreatePaymentMethodResponse {
  success: boolean;
  msg: string;
  data: PaymentMethod;
}

// Meta Information
export interface PaymentMethodListMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

// Payment Method List API Response
export interface PaymentMethodListResponse {
  success: boolean;
  msg: string;
  data: PaymentMethod[];
  meta: PaymentMethodListMeta;
}

// Query Filter Parameters
export interface PaymentMethodFilterQuery {
  page?: number;
  per_page?: number;
  type?: PaymentMethodType;
}
