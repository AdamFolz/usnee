import React from 'react';
import { Zap, Coffee, Users, Frown, Repeat, PartyPopper, Flame, FlaskConical, HelpCircle } from 'lucide-react';
import type { TriggerCode } from '@/types';

interface TriggerOption {
  code: TriggerCode;
  label: string;
  icon: React.ElementType;
  color: string;
}

const TRIGGERS: TriggerOption[] = [
  { code: 'stress', label: 'Стресс', icon: Zap, color: 'bg-tg-danger' },
  { code: 'boredom', label: 'Скука', icon: Coffee, color: 'bg-tg-text-tertiary' },
  { code: 'company', label: 'Компания', icon: Users, color: 'bg-tg-primary' },
  { code: 'pain', label: 'Боль', icon: Frown, color: 'bg-tg-warning' },
  { code: 'habit', label: 'Привычка', icon: Repeat, color: 'bg-usnee-500' },
  { code: 'celebration', label: 'Праздник', icon: PartyPopper, color: 'bg-tg-success' },
  { code: 'withdrawal', label: 'Ломка', icon: Flame, color: 'bg-tg-danger' },
  { code: 'experiment', label: 'Эксперимент', icon: FlaskConical, color: 'bg-tg-success' },
  { code: 'no_reason', label: 'Просто так', icon: HelpCircle, color: 'bg-tg-text-secondary' },
];

interface Props {
  selected: TriggerCode | null;
  onSelect: (code: TriggerCode) => void;
}

export const TriggerSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {TRIGGERS.map((trigger) => {
        const Icon = trigger.icon;
        const isSelected = selected === trigger.code;

        return (
          <button
            key={trigger.code}
            onClick={() => onSelect(trigger.code)}
            className={`
              flex flex-col items-center p-4 rounded-2xl transition-all
              ${isSelected
                ? 'bg-tg-primary/20 ring-2 ring-tg-primary'
                : 'bg-tg-bg-elevated border border-tg-separator hover:bg-tg-bg-secondary'}
            `}
          >
            <div className={`p-3 rounded-full ${trigger.color} mb-2`}>
              <Icon size={24} className="text-white" />
            </div>
            <span className={`text-sm ${isSelected ? 'text-tg-text' : 'text-tg-text-secondary'}`}>{trigger.label}</span>
          </button>
        );
      })}
    </div>
  );
};
