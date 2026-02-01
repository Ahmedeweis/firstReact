import type { ChargeRequest, ChargeResponse } from 'src/types/investor/charge';

import { endpoints, createResource } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function createChargeRequest(data: ChargeRequest): Promise<ChargeResponse> {
  const formData = new FormData();

  // Add payment type
  formData.append('payment_type', data.payment_type);

  // Add payment method ID
  formData.append('payment_method_id', String(data.payment_method_id));

  // Add amount
  formData.append('amount', String(data.amount));

  return createResource<ChargeResponse>(endpoints.investor.charge, formData);
}
