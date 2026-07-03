import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export function useHistory(limit = 50) {
  return useInfiniteQuery({
    queryKey: ['history'],
    queryFn: ({ pageParam }) => api.getHistory(pageParam, limit),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}

export function useLastInjection() {
  return useQuery({
    queryKey: ['history', 'last'],
    queryFn: () => api.getHistory(null, 1),
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}