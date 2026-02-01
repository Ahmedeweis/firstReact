import type {
  TransactionListMeta,
  TransactionFilterQuery,
  TransactionListResponse,
} from 'src/types/investor/transactions';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetTransactions(filters: TransactionFilterQuery = {}) {
  const {
    page,
    per_page,
    type,
    status,
    start_date,
    end_date,
    min_amount,
    max_amount,
    sort_by,
    sort_direction,
  } = filters;

  const queryParams = new URLSearchParams();

  if (page !== undefined) queryParams.set('page', String(page));
  if (per_page !== undefined) queryParams.set('per_page', String(per_page));
  if (type) {
    queryParams.set('type', type);
  }
  if (status !== undefined) queryParams.set('status', status);
  if (start_date != null) queryParams.set('start_date', String(start_date));
  if (end_date != null) queryParams.set('end_date', String(end_date));
  if (min_amount !== undefined) queryParams.set('min_amount', min_amount);
  if (max_amount !== undefined) queryParams.set('max_amount', max_amount);
  if (sort_by) {
    queryParams.set('sort_by', sort_by);
  }
  if (sort_direction) {
    queryParams.set('sort_direction', sort_direction);
  }

  const url = `${endpoints.investor.transactions}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR<TransactionListResponse>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      transactions: data?.data || [],
      transactionsMeta:
        data?.meta ||
        ({ currentPage: 1, perPage: 0, total: 0, lastPage: 1 } as TransactionListMeta),
      transactionsLoading: isLoading,
      transactionsError: error,
      transactionsValidating: isValidating,
      transactionsEmpty: !isLoading && !data?.data.length,
      refetch: () => mutate(),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating, mutate]
  );
}
