import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, TrendingUp, Clock, Syringe, Edit3 } from 'lucide-react';
import type { User, UserStats } from '@/types';

interface Props {
  user: User | null;
  stats: UserStats | null;
  onBack: () => void;
  onEdit: () => void;
  onAchievements: () => void;
}

export const ProfilePage: React.FC<Props> = ({ user, stats, onBack, onEdit, onAchievements }) => {
  const level = stats?.level ?? 1;
  const xp = stats?.total_xp ?? 0;
  const dailyCount = stats?.daily_count ?? 0;
  const lastAgo = stats?.last_injection_ago ?? '—';
  const avgInterval = stats?.avg_interval ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-tg-bg pb-20"
    >
      {/* Glass Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tg-primary/20 to-transparent" />
        <div className="relative p-6 pt-12">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-2 glass rounded-full">
              <ArrowLeft size={20} className="text-tg-text" />
            </button>
            <button onClick={onEdit} className="p-2 glass rounded-full">
              <Edit3 size={20} className="text-tg-text" />
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-tg-primary to-usnee-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-tg-primary/20"
            >
              {user?.first_name?.[0] || '👤'}
            </motion.div>
            <h1 className="text-2xl font-bold text-tg-text mt-4">{user?.first_name || 'Аноним'}</h1>
            <p className="text-tg-text-secondary text-sm">@{user?.username || 'user'}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 -mt-2">
        <div className="glass grid grid-cols-3 gap-3 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-tg-text">{level}</p>
            <p className="text-xs text-tg-text-secondary mt-1">Уровень</p>
          </div>
          <div className="text-center border-x border-tg-separator">
            <p className="text-2xl font-bold text-tg-text">{xp}</p>
            <p className="text-xs text-tg-text-secondary mt-1">XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-tg-text">{dailyCount}</p>
            <p className="text-xs text-tg-text-secondary mt-1">Сегодня</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* XP Progress */}
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-tg-text">Прогресс</span>
            <span className="text-xs text-tg-primary">{xp % 100}/100 XP</span>
          </div>
          <div className="w-full bg-tg-bg rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-tg-primary to-usnee-400 rounded-full h-full"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tg-success/15 flex items-center justify-center">
              <Clock size={20} className="text-tg-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-tg-text">{lastAgo}</p>
              <p className="text-xs text-tg-text-secondary">Последняя</p>
            </div>
          </div>
          <div className="glass p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tg-warning/15 flex items-center justify-center">
              <TrendingUp size={20} className="text-tg-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-tg-text">
                {avgInterval ? `${avgInterval.toFixed(1)}ч` : '—'}
              </p>
              <p className="text-xs text-tg-text-secondary">Средний инт.</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <button onClick={onAchievements} className="w-full glass p-4 flex items-center justify-between card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-usnee-500/15 flex items-center justify-center">
              <Award size={20} className="text-usnee-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-tg-text">Достижения</p>
              <p className="text-xs text-tg-text-secondary">{user?.recent_achievements?.length || 0} разблокировано</p>
            </div>
          </div>
          <Syringe size={18} className="text-tg-text-tertiary rotate-90" />
        </button>
      </div>
    </motion.div>
  );
};
