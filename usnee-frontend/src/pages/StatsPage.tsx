import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Clock, Award, Activity } from 'lucide-react';
import type { UserStats } from '@/types';

interface Props {
  stats: UserStats | null;
  onBack: () => void;
}

interface ChartDay {
  day: string;
  count: number;
}

export const StatsPage: React.FC<Props> = ({ stats, onBack }) => {
  const weekly: ChartDay[] = [
    { day: 'Пн', count: 2 }, { day: 'Вт', count: 1 }, { day: 'Ср', count: 3 },
    { day: 'Чт', count: 0 }, { day: 'Пт', count: 2 }, { day: 'Сб', count: 4 }, { day: 'Вс', count: 1 },
  ];
  const monthly = 12;
  const dailyCount = stats?.daily_count ?? 0;
  const lastAgo = stats?.last_injection_ago ?? '—';
  const avgInterval = stats?.avg_interval ?? null;
  const level = stats?.level ?? 1;
  const xp = stats?.total_xp ?? 0;

  const chartData = weekly;
  const maxCount = Math.max(...chartData.map((d: ChartDay) => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-tg-bg pb-20"
    >
      <div className="flex items-center gap-4 p-4 border-b border-tg-separator">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-tg-bg-elevated transition-colors">
          <ArrowLeft size={24} className="text-tg-text" />
        </button>
        <h1 className="text-xl font-bold text-tg-text">Статистика</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center">
            <Activity size={24} className="text-tg-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-tg-text">{dailyCount}</p>
            <p className="text-tg-text-secondary text-sm">Сегодня</p>
          </div>
          <div className="card text-center">
            <Clock size={24} className="text-tg-success mx-auto mb-2" />
            <p className="text-xl font-bold text-tg-text">{lastAgo}</p>
            <p className="text-tg-text-secondary text-sm">С последней</p>
          </div>
          <div className="card text-center">
            <TrendingUp size={24} className="text-tg-warning mx-auto mb-2" />
            <p className="text-xl font-bold text-tg-text">{avgInterval ? `${avgInterval.toFixed(1)}ч` : '—'}</p>
            <p className="text-tg-text-secondary text-sm">Средний интервал</p>
          </div>
          <div className="card text-center">
            <Calendar size={24} className="text-usnee-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-tg-text">{monthly}</p>
            <p className="text-tg-text-secondary text-sm">За месяц</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Award size={24} className="text-usnee-400" />
            <div>
              <p className="font-semibold text-tg-text">Уровень {level}</p>
              <p className="text-tg-text-secondary text-sm">{xp} XP</p>
            </div>
          </div>
          <div className="w-full bg-tg-bg-secondary rounded-full h-3">
            <div className="bg-usnee-500 rounded-full h-3 transition-all" style={{ width: `${Math.min((xp % 100) / 100 * 100, 100)}%` }} />
          </div>
          <p className="text-tg-text-tertiary text-xs mt-2">{100 - (xp % 100)} XP до следующего уровня</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-tg-text mb-4">За неделю</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {chartData.map((day: ChartDay, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-tg-primary/60 rounded-t-lg transition-all" style={{ height: `${(day.count / maxCount) * 100}%` }} />
                <p className="text-xs text-tg-text-tertiary">{day.day}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
