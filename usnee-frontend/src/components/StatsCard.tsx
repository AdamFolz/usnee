import React from 'react';
import { motion } from 'framer-motion';
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

  const items = [
    { icon: Syringe, color: 'text-tg-primary', bg: 'bg-tg-primary/15', label: 'Сегодня', value: dailyCount, size: 'text-3xl' },
    { icon: Clock, color: 'text-tg-success', bg: 'bg-tg-success/15', label: 'Последняя', value: lastAgo, size: 'text-xl' },
    { icon: TrendingUp, color: 'text-tg-warning', bg: 'bg-tg-warning/15', label: 'Средний инт.', value: avgInterval ? `${avgInterval.toFixed(1)}ч` : '—', size: 'text-xl' },
    { icon: Award, color: 'text-usnee-400', bg: 'bg-usnee-500/15', label: 'Уровень', value: `${level}`, sub: `${xp} XP`, size: 'text-xl' },
  ];

  return (
    <div className="mx-4 glass p-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={item.color} />
              </div>
              <div className="min-w-0">
                <p className="text-tg-text-secondary text-[11px] uppercase tracking-wider">{item.label}</p>
                <p className={`font-bold text-tg-text ${item.size}`}>{item.value}</p>
                {item.sub && <p className="text-[11px] text-tg-text-tertiary">{item.sub}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
