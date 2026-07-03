export type InjectionMethod = 'intravenous' | 'intramuscular' | 'subcutaneous';

export type InjectionSite =
  | 'left_arm'
  | 'right_arm'
  | 'left_leg'
  | 'right_leg'
  | 'abdomen'
  | 'chest'
  | 'neck'
  | 'other';

export type TriggerCode =
  | 'stress'
  | 'boredom'
  | 'company'
  | 'pain'
  | 'habit'
  | 'celebration'
  | 'withdrawal'
  | 'experiment'
  | 'no_reason';

export interface Trigger {
  code: TriggerCode;
  label: string;
  icon: string;
  color: string;
}

export interface Injection {
  id: number;
  method: InjectionMethod;
  site: InjectionSite;
  volume_ml: number;
  trigger: TriggerCode | null;
  trigger_note: string | null;
  injected_at: string;
  is_cancelled: boolean;
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'ironic' | 'positive' | 'neutral';
  xp_reward?: number;
  isNew?: boolean;
}

export interface UserStats {
  daily_count: number;
  avg_interval: number | null;
  last_injection_ago: string | null;
  top_trigger: string | null;
  total_xp: number;
  level: number;
}

export interface User {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  xp: number;
  level: number;
  recent_achievements: Achievement[];
}

export interface InjectionCreate {
  method: InjectionMethod;
  site: InjectionSite;
  volume_ml: number;
  trigger?: TriggerCode;
  trigger_note?: string;
  batch_id?: number;
}

export interface InjectionResponse {
  success: boolean;
  injection_id: number;
  new_achievements: Achievement[];
  message: string;
}

export interface HistoryResponse {
  items: Injection[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface EmergencyContact {
  name: string;
  phone?: string;
  url?: string;
  description: string;
  icon: string;
}
