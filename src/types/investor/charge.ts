// Charge Types
export interface ChargeRequest {
  payment_type: string;
  payment_method_id: number;
  amount: number;
}

export interface ChargeResponse {
  success: boolean;
  msg: string;
  data?: {
    id: number;
    amount: number;
    status: string;
    created_at: string;
  };
}

// Charge Form Data
export interface ChargeFormData {
  payment_type: string;
  payment_method_id: number;
  amount: number;
}

// Payment Types
export enum PaymentType {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Amex = 'amex',
}
