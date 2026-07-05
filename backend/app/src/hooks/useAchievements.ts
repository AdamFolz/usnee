import { trpc } from "@/providers/trpc";

export function useAchievements() {
  return trpc.achievements.list.useQuery();
}
