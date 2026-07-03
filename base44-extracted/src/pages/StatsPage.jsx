import { motion } from 'framer-motion';
import { Clock, Target, Zap, Award } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import XPBar from '@/components/stats/XPBar';
import AchievementCard from '@/components/stats/AchievementCard';
import { TRIGGER_LABELS } from '@/lib/constants';

function StatCard({ icon: Icon, label, value, color = 'primary', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-tg-text-secondary" />
        <span className="text-xs text-tg-text-secondary uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-tg-text">{value}</p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton h-4 w-20 mb-3" />
      <div className="skeleton h-7 w-16" />
    </div>
  );
}

export default function StatsPage() {
  const { data: stats, isLoading } = useStats();

  const totalCount = stats?.total_count ?? 0;
  const estimatedXp = totalCount * 10;
  const estimatedLevel = 1 + Math.floor(estimatedXp / 100);

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* XP Bar */}
      {isLoading ? (
        <div className="card">
          <div className="skeleton h-5 w-32 mb-4" />
          <div className="skeleton h-2.5 w-full rounded-full" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <XPBar xp={estimatedXp} level={estimatedLevel} />
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              icon={Zap}
              label="Сегодня"
              value={stats?.daily_count ?? 0}
              delay={0.05}
            />
            <StatCard
              icon={Target}
              label="Всего"
              value={stats?.total_count ?? 0}
              delay={0.1}
            />
          </>
        )}
      </div>

      {/* Additional stats */}
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-tg-text-secondary" />
              <span className="text-xs text-tg-text-secondary uppercase tracking-wide">
                Последняя
              </span>
            </div>
            <span className="text-sm font-medium text-tg-text">
              {stats?.last_injection_ago || 'нет записей'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-tg-text-secondary" />
              <span className="text-xs text-tg-text-secondary uppercase tracking-wide">
                Топ триггер
              </span>
            </div>
            <span className="text-sm font-medium text-tg-text">
              {stats?.top_trigger
                ? TRIGGER_LABELS[stats.top_trigger] || stats.top_trigger
                : '—'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Award className="w-4 h-4 text-tg-text-secondary" />
          <h2 className="text-sm font-semibold text-tg-text-secondary uppercase tracking-wide">
            Достижения
          </h2>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-2" />
                    <div className="skeleton h-3 w-48" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stats?.recent_achievements && stats.recent_achievements.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_achievements.map((ach, i) => (
              <motion.div
                key={ach.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <AchievementCard achievement={ach} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-tg-text-secondary">
              Достижения появятся по мере использования
            </p>
          </div>
        )}
      </div>
    </div>
  );
}