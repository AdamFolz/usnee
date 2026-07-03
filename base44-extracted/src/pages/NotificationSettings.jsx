import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Clock, Calendar } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
        checked ? 'bg-tg-primary' : 'bg-tg-border'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

const FREQUENCIES = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'every_2_days', label: 'Каждые 2 дня' },
  { value: 'weekly', label: 'Еженедельно' },
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);
  const [morningTime, setMorningTime] = useState('09:00');
  const [eveningTime, setEveningTime] = useState('21:00');
  const [frequency, setFrequency] = useState('daily');
  const [streakReminders, setStreakReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('usnee_notification_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setEnabled(settings.enabled ?? true);
      setMorningTime(settings.morningTime ?? '09:00');
      setEveningTime(settings.eveningTime ?? '21:00');
      setFrequency(settings.frequency ?? 'daily');
      setStreakReminders(settings.streakReminders ?? true);
      setAchievementAlerts(settings.achievementAlerts ?? true);
      setWeeklyReport(settings.weeklyReport ?? false);
    }
  }, []);

  const save = (partial) => {
    const settings = {
      enabled,
      morningTime,
      eveningTime,
      frequency,
      streakReminders,
      achievementAlerts,
      weeklyReport,
      ...partial,
    };
    localStorage.setItem('usnee_notification_settings', JSON.stringify(settings));
  };

  const updateEnabled = (val) => { setEnabled(val); save({ enabled: val }); };
  const updateMorning = (val) => { setMorningTime(val); save({ morningTime: val }); };
  const updateEvening = (val) => { setEveningTime(val); save({ eveningTime: val }); };
  const updateFrequency = (val) => { setFrequency(val); save({ frequency: val }); };
  const updateStreak = (val) => { setStreakReminders(val); save({ streakReminders: val }); };
  const updateAchievement = (val) => { setAchievementAlerts(val); save({ achievementAlerts: val }); };
  const updateWeekly = (val) => { setWeeklyReport(val); save({ weeklyReport: val }); };

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Настройка уведомлений" icon={BellRing} />

      <div className="space-y-4">
        {/* Master toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-tg-text">Уведомления</p>
                <p className="text-xs text-tg-text-secondary">Включить все напоминания</p>
              </div>
              <Toggle checked={enabled} onChange={updateEnabled} />
            </div>
          </div>
        </motion.div>

        {enabled && (
          <>
            {/* Times */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-tg-text-secondary" />
                  <span className="text-xs text-tg-text-secondary uppercase tracking-wide">Время напоминаний</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-tg-text">Утреннее</p>
                      <p className="text-xs text-tg-text-secondary">Напоминание утром</p>
                    </div>
                    <input
                      type="time"
                      value={morningTime}
                      onChange={(e) => updateMorning(e.target.value)}
                      className="input w-28"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-tg-text">Вечернее</p>
                      <p className="text-xs text-tg-text-secondary">Напоминание вечером</p>
                    </div>
                    <input
                      type="time"
                      value={eveningTime}
                      onChange={(e) => updateEvening(e.target.value)}
                      className="input w-28"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Frequency */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-tg-text-secondary" />
                  <span className="text-xs text-tg-text-secondary uppercase tracking-wide">Частота</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => updateFrequency(f.value)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
                        frequency === f.value
                          ? 'bg-tg-primary/15 border-tg-primary text-tg-primary'
                          : 'bg-tg-bg border-tg-border text-tg-text-secondary'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Types */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="card">
                <p className="text-xs text-tg-text-secondary uppercase tracking-wide mb-3">Типы уведомлений</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-tg-text">Напоминания о записях</p>
                      <p className="text-xs text-tg-text-secondary">Не забывать вести дневник</p>
                    </div>
                    <Toggle checked={streakReminders} onChange={updateStreak} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-tg-text">Новые достижения</p>
                      <p className="text-xs text-tg-text-secondary">Уведомлять о наградах</p>
                    </div>
                    <Toggle checked={achievementAlerts} onChange={updateAchievement} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-tg-text">Недельный отчёт</p>
                      <p className="text-xs text-tg-text-secondary">Сводка за неделю</p>
                    </div>
                    <Toggle checked={weeklyReport} onChange={updateWeekly} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}