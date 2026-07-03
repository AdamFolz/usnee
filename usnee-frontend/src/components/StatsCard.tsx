import React from 'react';
import { Clock, Syringe, TrendingUp, Award } from 'lucide-react';
import type { UserStats } from '@/types';

interface Props {
  stats: UserStats | null;
}

export const StatsCard: React.FC<Props> = ({ stats }) => {
  const dailyCount = stats?.daily_count ?? 0;
  const lastAgo = stats?.last_injection_ago ?? '—';
  const avgInterval = stats?.avg_interval ?? null;
  const level = stats?.level ?? 1;
  const xp = stats?.total_xp ?? 0;

  return (
    <div className="mx-4 card">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-tg-primary/10 rounded-2xl">
            <Syringe size={24} className="text-tg-primary" />
          </div>
          <div>
            <p className="text-tg-text-secondary text-xs">Сегодня</p>
            <p className="text-2xl font-bold text-tg-text">{dailyCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-tg-success/10 rounded-2xl">
            <Clock size={24} className="text-tg-success" />
          </div>
          <div>
            <p className="text-tg-text-secondary text-xs">Последняя</p>
            <p className="text-lg font-semibold text-tg-text">{lastAgo}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-tg-warning/10 rounded-2xl">
            <TrendingUp size={24} className="text-tg-warning" />
          </div>
          <div>
            <p className="text-tg-text-secondary text-xs">Средний интервал</p>
            <p className="text-lg font-semibold text-tg-text">
              {avgInterval ? `${avgInterval.toFixed(1)}ч` : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-usnee-500/10 rounded-2xl">
            <Award size={24} className="text-usnee-400" />
          </div>
          <div>
            <p className="text-tg-text-secondary text-xs">Уровень</p>
            <p className="text-lg font-semibold text-tg-text">{level} <span className="text-xs text-tg-text-tertiary">({xp} XP)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
