import type {
  PaymentMethodListMeta,
  PaymentMethodFilterQuery,
  PaymentMethodListResponse,
  CreatePaymentMethodRequest,
  CreatePaymentMethodResponse,
} from 'src/types/investor/payment-methods';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, createResource, deleteResource } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetPaymentMethods(filters: PaymentMethodFilterQuery = {}) {
  const { page, per_page, type } = filters;

  const queryParams = new URLSearchParams();

  if (page !== undefined) queryParams.set('page', String(page));
  if (per_page !== undefined) queryParams.set('per_page', String(per_page));
  if (type) {
    queryParams.set('type', type);
  }

  const url = `${endpoints.investor.paymentMethods}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR<PaymentMethodListResponse>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      paymentMethods: data?.data || [],
      paymentMethodsMeta:
        data?.meta ||
        ({ currentPage: 1, perPage: 0, total: 0, lastPage: 1 } as PaymentMethodListMeta),
      paymentMethodsLoading: isLoading,
      paymentMethodsError: error,
      paymentMethodsValidating: isValidating,
      paymentMethodsEmpty: !isLoading && !data?.data.length,
      refetch: () => mutate(),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating, mutate]
  );
}

// ----------------------------------------------------------------------

export async function createPaymentMethod(
  data: CreatePaymentMethodRequest
): Promise<CreatePaymentMethodResponse> {
  const formData = new FormData();

  // Add basic fields
  formData.append('type', data.type);
  formData.append('name', data.name);

  // Add optional fields
  if (data.card_number) formData.append('card_number', data.card_number);
  if (data.expiry) formData.append('expiry', data.expiry);
  if (data.cvc) formData.append('cvc', data.cvc);

  return createResource<CreatePaymentMethodResponse>(endpoints.investor.paymentMethods, formData);
}

// ----------------------------------------------------------------------

export async function deletePaymentMethod(id: number): Promise<void> {
  return deleteResource(`${endpoints.investor.paymentMethods}/${id}`);
}
