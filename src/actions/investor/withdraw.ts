import type { WithdrawRequest, WithdrawResponse } from 'src/types/investor/withdraw';

import { endpoints, createResource } from 'src/utils/axios';


// ----------------------------------------------------------------------

export async function createWithdrawRequest(data: WithdrawRequest): Promise<WithdrawResponse> {
  const formData = new FormData();

  // Add payment type (should be 'bank_transfer')
  formData.append('payment_type', data.payment_type);

  // Add amount
  formData.append('amount', String(data.amount));

  // Add IBAN
  formData.append('iban', data.iban);

  // Add name
  formData.append('name', data.name);

  // Add SWIFT code
  formData.append('swift_code', data.swift_code);

  return createResource<WithdrawResponse>(endpoints.investor.withdraw, formData);
}
