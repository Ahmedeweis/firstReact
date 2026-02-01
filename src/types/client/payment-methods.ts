// Payment Method Enums
export enum PaymentMethodType {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Amex = 'amex',
  BankTransfer = 'bank_transfer',
  Paypal = 'paypal',
}

// Payment Method Model
export interface PaymentMethod {
  id: number;
  name: string;
  card_number: string;
  expiry: string;
  cvc: string;
  type: PaymentMethodType | string;
}

// Create Payment Method Request
export interface CreatePaymentMethodRequest {
  type: PaymentMethodType | string;
  name: string;
  card_number: string;
  expiry: string;
  cvc: string;
}

// Create Payment Method Response
export interface CreatePaymentMethodResponse {
  success: boolean;
  msg: string;
  data: PaymentMethod;
}

// Payment Method List API Response
export interface PaymentMethodListResponse {
  success: boolean;
  msg: string;
  data: PaymentMethod[];
}




