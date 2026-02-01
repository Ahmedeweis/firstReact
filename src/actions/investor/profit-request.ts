import type {
  IProfitRequestForm,
  InvestorProfitRequestMeta,
  IProfitRequestSingleResponse,
  InvestorProfitRequestListResponse,
} from 'src/types/investor/profit-requests';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, createResource } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetInvestorProfitRequests(params?: Record<string, any>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const url = `${endpoints.investor.profitRequest}${query}`;

  const { data, isLoading, error, isValidating, mutate } =
    useSWR<InvestorProfitRequestListResponse>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      profitRequests: data?.data || [],
      profitRequestsMeta:
        data?.meta ||
        ({ currentPage: 1, perPage: 0, total: 0, lastPage: 1 } as InvestorProfitRequestMeta),
      profitRequestsLoading: isLoading,
      profitRequestsError: error,
      profitRequestsValidating: isValidating,
      profitRequestsEmpty: !isLoading && !data?.data.length,
      refetch: () => mutate(),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating, mutate]
  );
}

// ----------------------------------------------------------------------

export function sendProfitRequest(data: IProfitRequestForm): Promise<IProfitRequestSingleResponse> {
  const relativeUrl = `${endpoints.investor.profitRequest}`;

  try {
    const formData = new FormData();
    formData.append('amount', data.amount);
    formData.append('message', data.message);

    return createResource<IProfitRequestSingleResponse>(relativeUrl, formData);
  } catch (error) {
    console.error('Failed to send profit request:', error);
    throw error;
  }
}
