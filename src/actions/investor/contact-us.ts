import type {
  IContactUsForm,
  InvestorContactUsMeta,
  IContactUsSingleResponse,
  InvestorContactUsListResponse,
} from 'src/types/investor/contact-us';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, createResource } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetInvestorContactMessages() {
  const url = endpoints.investor.contactUs;

  const { data, isLoading, error, isValidating, mutate } = useSWR<InvestorContactUsListResponse>(
    url,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      contactMessages: data?.data || [],
      contactMessagesMeta:
        data?.meta ||
        ({ currentPage: 1, perPage: 0, total: 0, lastPage: 1 } as InvestorContactUsMeta),
      contactMessagesLoading: isLoading,
      contactMessagesError: error,
      contactMessagesValidating: isValidating,
      contactMessagesEmpty: !isLoading && !data?.data.length,
      refetch: () => mutate(),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating, mutate]
  );
}

export function sendContactUsMessage(data: IContactUsForm): Promise<IContactUsSingleResponse> {
  const relativeUrl = `${endpoints.investor.contactUs}`;
  try {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    return createResource<IContactUsSingleResponse>(relativeUrl, formData);
  } catch (error) {
    console.error('Failed to send contact us message:', error);
    throw error;
  }
}
