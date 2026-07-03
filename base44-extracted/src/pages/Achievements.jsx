import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useStats } from '@/hooks/useStats';
import { ALL_ACHIEVEMENTS } from '@/lib/achievements';

export default function AchievementsPage() {
  const { data: stats, isLoading } = useStats();
  const unlockedCodes = new Set(
    (stats?.recent_achievements || []).map((a) => a.code)
  );
  const unlockedCount = ALL_ACHIEVEMENTS.filter((a) => unlockedCodes.has(a.code)).length;

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Достижения" icon={Trophy} />

      <div className="space-y-4">
        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-tg-warning" />
              <p className="text-lg font-bold text-tg-text">
                {unlockedCount} / {ALL_ACHIEVEMENTS.length}
              </p>
            </div>
            <div className="w-full h-2 bg-tg-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tg-primary to-purple-400 rounded-full transition-all"
                style={{ width: `${(unlockedCount / ALL_ACHIEVEMENTS.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-tg-text-secondary mt-2">
              {unlockedCount === 0 ? 'Начните записывать, чтобы получать награды' : 'Так держать!'}
            </p>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-2">
          {ALL_ACHIEVEMENTS.map((ach, i) => {
            const unlocked = unlockedCodes.has(ach.code);
            return (
              <motion.div
                key={ach.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div
                  className={`card flex items-center gap-3 ${unlocked ? '' : 'opacity-50'}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      unlocked ? 'bg-tg-warning/15' : 'bg-tg-bg grayscale'
                    }`}
                  >
                    {unlocked ? ach.icon : <Lock className="w-5 h-5 text-tg-text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-tg-text">{ach.title}</p>
                    <p className="text-xs text-tg-text-secondary">{ach.description}</p>
                    <p className="text-xs text-tg-primary mt-0.5">{ach.condition}</p>
                  </div>
                  {unlocked && (
                    <span className="px-2 py-1 rounded-lg bg-tg-success/10 text-tg-success text-[10px] font-bold uppercase">
                      ✓
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}