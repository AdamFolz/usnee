import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Droplet, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStats } from '@/hooks/useStats';
import { useLastInjection } from '@/hooks/useHistory';
import { useCreateInjection } from '@/hooks/useInjection';
import InjectionForm from '@/components/injection/InjectionForm';
import AchievementToast from '@/components/injection/AchievementToast';
import { METHOD_ICONS, TRIGGER_LABELS } from '@/lib/constants';

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const prevAchCodes = useRef(new Set());
  const hasInitialized = useRef(false);

  const { data: stats } = useStats();
  const { data: lastInjectionData } = useLastInjection();
  const createMutation = useCreateInjection();

  const lastInjection = lastInjectionData?.items?.[0];

  useEffect(() => {
    if (stats?.recent_achievements) {
      const currentCodes = new Set(
        stats.recent_achievements.map((a) => a.code)
      );
      if (hasInitialized.current && prevAchCodes.current.size > 0) {
        const newOnes = stats.recent_achievements.filter(
          (a) => !prevAchCodes.current.has(a.code)
        );
        if (newOnes.length > 0) {
          setNewAchievements(newOnes);
        }
      }
      prevAchCodes.current = currentCodes;
      hasInitialized.current = true;
    }
  }, [stats?.recent_achievements]);

  const handleSubmit = async (data) => {
    setSubmitError(null);
    try {
      await createMutation.mutateAsync(data);
      setFormOpen(false);
      return true;
    } catch (e) {
      setSubmitError(e.message || 'Не удалось сохранить');
      return false;
    }
  };

  return (
    <div className="px-4 pt-4 space-y-4">
      <AchievementToast
        achievements={newAchievements}
        onClose={() => setNewAchievements([])}
      />

      {/* Today counter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-tg-text-secondary">Сегодня</p>
          <p className="text-3xl font-bold text-tg-text">
            {stats?.daily_count ?? 0}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-tg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-tg-primary" />
        </div>
      </motion.div>

      {/* Last injection */}
      {lastInjection ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card"
        >
          <p className="text-xs text-tg-text-secondary uppercase tracking-wide mb-3">
            Последняя запись
          </p>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-tg-bg flex items-center justify-center text-xl shrink-0">
              {METHOD_ICONS[lastInjection.method] || '💉'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-tg-text">
                {lastInjection.volume_ml} мл
                {lastInjection.trigger &&
                  ` · ${TRIGGER_LABELS[lastInjection.trigger] || lastInjection.trigger}`}
              </p>
              <p className="text-sm text-tg-text-secondary truncate">
                {lastInjection.site}
              </p>
              <p className="text-xs text-tg-text-secondary mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(lastInjection.injected_at), {
                  addSuffix: true,
                  locale: ru,
                })}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card text-center py-8"
        >
          <div className="text-4xl mb-3">💜</div>
          <p className="font-semibold text-tg-text mb-1">Добро пожаловать</p>
          <p className="text-sm text-tg-text-secondary">
            Запишите первую инъекцию, чтобы начать отслеживать
          </p>
        </motion.div>
      )}

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setSubmitError(null);
          setFormOpen(true);
        }}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
      >
        <Plus className="w-5 h-5" />
        Записать инъекцию
      </motion.button>

      <InjectionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        submitError={submitError}
      />
    </div>
  );
}