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
  { code: 'stress', label: 'Стресс', icon: Zap, color: 'bg-red-500' },
  { code: 'boredom', label: 'Скука', icon: Coffee, color: 'bg-gray-500' },
  { code: 'company', label: 'Компания', icon: Users, color: 'bg-blue-500' },
  { code: 'pain', label: 'Боль', icon: Frown, color: 'bg-orange-500' },
  { code: 'habit', label: 'Привычка', icon: Repeat, color: 'bg-purple-500' },
  { code: 'celebration', label: 'Праздник', icon: PartyPopper, color: 'bg-yellow-500' },
  { code: 'withdrawal', label: 'Ломка', icon: Flame, color: 'bg-amber-600' },
  { code: 'experiment', label: 'Эксперимент', icon: FlaskConical, color: 'bg-emerald-500' },
  { code: 'no_reason', label: 'Просто так', icon: HelpCircle, color: 'bg-slate-500' },
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
                ? 'bg-white/20 ring-2 ring-white'
                : 'bg-white/5 hover:bg-white/10'}
            `}
          >
            <div className={`p-3 rounded-full ${trigger.color} mb-2`}>
              <Icon size={24} className="text-white" />
            </div>
            <span className="text-sm text-gray-300">{trigger.label}</span>
          </button>
        );
      })}
    </div>
  );
};
