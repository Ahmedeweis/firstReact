import type { ICategory, ICategoryListResponse } from 'src/types/category';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetCategories(params?: Record<string, any>) {
  const url = endpoints.category.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ICategoryListResponse>(
    [url, { params }],
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      categories: (data?.data as ICategory[]) || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.data.length,
      meta: data?.meta || {
        currentPage: 1,
        perPage: 20,
        total: 0,
        lastPage: 1,
      },
      mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCategory(id: string) {
  const url = id ? endpoints.category.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      category: data?.data as ICategory,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
