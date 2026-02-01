import useSWR from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

export function useGetClientOrders() {
  const { data, isLoading, error, mutate } = useSWR(endpoints.order.list, fetcher, swrOptions);

  return {
    orders: data?.data || [],
    ordersLoading: isLoading,
    ordersError: error,
    refetch: () => mutate(),
  };
}




