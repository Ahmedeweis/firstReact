// Withdraw Types
export const WITHDRAW_PAYMENT_TYPE = {
  BANK_TRANSFER: 'bank_transfer',
} as const;

export interface WithdrawRequest {
  payment_type: string;
  amount: number;
  iban: string;
  name: string;
  swift_code: string;
}

export interface WithdrawResponse {
  success: boolean;
  msg: string;
  data?: {
    id: number;
    amount: number;
    status: string;
    created_at: string;
  };
}

// Withdraw Form Data
export interface WithdrawFormData {
  payment_type: string;
  amount: number;
  iban: string;
  name: string;
  swift_code: string;
}

// Validation Schema
export interface WithdrawValidation {
  amount: {
    required: boolean;
    min?: number;
    max?: number;
  };
  payment_type: {
    required: boolean;
  };
  iban: {
    required: boolean;
    pattern?: string;
  };
  name: {
    required: boolean;
  };
  swift_code: {
    required: boolean;
    pattern?: string;
  };
}
