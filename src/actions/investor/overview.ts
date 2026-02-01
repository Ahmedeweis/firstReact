import type { OverviewResponse } from 'src/types/investor/overview';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

export const useGetInvestorOverview = () => {
  const { data, error } = useSWR<OverviewResponse>(
    endpoints.investor.overview,
    fetcher,
    swrOptions
  );

  return {
    overview: data?.data || null,
    balance: data?.data?.balance || 0,
    totalProfits: data?.data?.total_profits || 0,
    recentTransactions: data?.data?.recent_transactions || [],
    isLoading: !error && !data,
    isError: error,
  };
};
