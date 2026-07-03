import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export function useCreateInjection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.createInjection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useCancelInjection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => api.cancelInjection(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}