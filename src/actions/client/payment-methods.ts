import type {
  PaymentMethodListResponse,
  CreatePaymentMethodRequest,
  CreatePaymentMethodResponse,
} from 'src/types/client/payment-methods';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance from 'src/utils/axios';
import { endpoints, fetcher } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetPaymentMethods() {
  const url = endpoints.auth.paymentMethods;

  const { data, isLoading, error, isValidating, mutate } = useSWR<PaymentMethodListResponse>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      paymentMethods: data?.data || [],
      paymentMethodsLoading: isLoading,
      paymentMethodsError: error,
      paymentMethodsValidating: isValidating,
      paymentMethodsEmpty: !isLoading && !data?.data.length,
      refetch: () => mutate(),
    }),
    [data?.data, error, isLoading, isValidating, mutate]
  );
}

// ----------------------------------------------------------------------

export async function createPaymentMethod(
  data: CreatePaymentMethodRequest
): Promise<CreatePaymentMethodResponse> {
  try {
    const response = await axiosInstance.post<CreatePaymentMethodResponse>(
      endpoints.auth.paymentMethods,
      data
    );

    toast.success(response.data.msg || 'Payment method added successfully');
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.msg || error?.message || 'Failed to add payment method';
    toast.error(errorMessage);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deletePaymentMethod(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`${endpoints.auth.paymentMethods}/${id}`);
    toast.success('Payment method deleted successfully');
  } catch (error: any) {
    const errorMessage = error?.msg || error?.message || 'Failed to delete payment method';
    toast.error(errorMessage);
    throw error;
  }
}

