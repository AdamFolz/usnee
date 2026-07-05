import { trpc } from "@/providers/trpc";

export function useStats() {
  return trpc.injections.stats.useQuery(undefined, {
    refetchInterval: 30000,
  });
}

export function useHistory() {
  return trpc.injections.history.useQuery({ limit: 50 });
}

export function useCreateInjection() {
  const utils = trpc.useUtils();
  return trpc.injections.create.useMutation({
    onSuccess: () => {
      utils.injections.stats.invalidate();
      utils.injections.history.invalidate();
      utils.achievements.list.invalidate();
    },
  });
}

export function useCheckAchievements() {
  return trpc.achievements.check.useMutation();
}

export function useCancelInjection() {
  const utils = trpc.useUtils();
  return trpc.injections.cancel.useMutation({
    onSuccess: () => {
      utils.injections.stats.invalidate();
      utils.injections.history.invalidate();
    },
  });
}
