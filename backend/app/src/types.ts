export type Tab = "home" | "history" | "settings";

export type Method = "intravenous" | "intramuscular" | "subcutaneous";

export type Trigger =
  | "stress"
  | "boredom"
  | "company"
  | "pain"
  | "habit"
  | "celebration"
  | "withdrawal"
  | "experiment"
  | "no_reason";

export interface Injection {
  id: number;
  method: Method;
  site: string;
  volumeMl: string;
  trigger: string | null;
  triggerNote: string | null;
  injectedAt: Date;
  isCancelled: boolean;
}

export interface Stats {
  dailyCount: number;
  lastInjectionAgo: string;
  avgInterval: number;
  topTrigger: string;
  totalXp: number;
  level: number;
}

export interface Achievement {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: "ironic" | "positive";
  unlocked: boolean;
  unlockedAt: Date | null;
}

export interface NewAchievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
}
