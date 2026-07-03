import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, History, Settings, Home, Heart, Wind } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import type { TriggerCode, InjectionMethod, InjectionSite } from '@/types';
import { useStore } from '@/stores/appStore';
import { StatsCard } from '@/components/StatsCard';
import { TriggerSelector } from '@/components/TriggerSelector';
import { IronicBadge } from '@/components/IronicBadge';
import { AchievementPopup } from '@/components/AchievementPopup';
import { EmergencyHelp } from '@/components/EmergencyHelp';
import { HistoryList } from '@/components/HistoryList';
import { BreathingExercise } from '@/components/BreathingExercise';
import { ErrorToast } from '@/components/ErrorToast';

type Tab = 'home' | 'history' | 'settings';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'home', label: 'Главная', icon: Home },
  { key: 'history', label: 'История', icon: History },
  { key: 'settings', label: 'Настройки', icon: Settings },
];

const METHODS: { code: InjectionMethod; label: string }[] = [
  { code: 'intravenous', label: 'В/в' },
  { code: 'intramuscular', label: 'В/м' },
  { code: 'subcutaneous', label: 'П/к' },
];

const SITES: { code: InjectionSite; label: string }[] = [
  { code: 'left_arm', label: 'Левая рука' },
  { code: 'right_arm', label: 'Правая рука' },
  { code: 'left_leg', label: 'Левая нога' },
  { code: 'right_leg', label: 'Правая нога' },
  { code: 'abdomen', label: 'Живот' },
  { code: 'chest', label: 'Грудь' },
  { code: 'neck', label: 'Шея' },
  { code: 'other', label: 'Другое' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerCode | null>(null);
  const [method, setMethod] = useState<InjectionMethod>('intravenous');
  const [site, setSite] = useState<InjectionSite>('left_arm');
  const [volume, setVolume] = useState<string>('1.0');
  const [note, setNote] = useState('');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showRecordConfirm, setShowRecordConfirm] = useState(false);

  const {
    user,
    stats,
    history,
    hasMore,
    isLoading,
    error,
    lastAchievement,
    showAchievement,
    init,
    recordInjection,
    loadHistory,
    loadMoreHistory,
    dismissAchievement,
    clearError,
  } = useStore();

  useEffect(() => {
    init();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, [init]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab, loadHistory]);

  const handleRecord = useCallback(async () => {
    if (!selectedTrigger) return;

    const vol = parseFloat(volume);
    if (isNaN(vol) || vol <= 0) {
      clearError();
      return;
    }

    await recordInjection({
      method,
      site,
      volume_ml: vol,
      trigger: selectedTrigger,
      trigger_note: note || undefined,
    });

    setSelectedTrigger(null);
    setNote('');
    setShowRecordConfirm(false);
  }, [selectedTrigger, volume, method, site, note, recordInjection, clearError]);

  const canRecord = selectedTrigger && parseFloat(volume) > 0;

  return (
    <div className="min-h-screen pb-20">
      <ErrorToast message={error} onDismiss={clearError} />
      <AchievementPopup
        achievement={lastAchievement}
        visible={showAchievement}
        onDismiss={dismissAchievement}
      />
      <BreathingExercise isOpen={showBreathing} onClose={() => setShowBreathing(false)} />
      <EmergencyHelp />

      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gradient">USNEE</h1>
        <p className="text-gray-400 mt-2 text-sm">Без осуждения, только факты</p>
        {user && (
          <p className="text-gray-500 text-xs mt-1">
            {user.first_name || 'Аноним'} · Уровень {user.level}
          </p>
        )}
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <StatsCard stats={stats} />

            {/* Trigger Selection */}
            <div>
              <h2 className="text-center text-gray-300 mb-2">Что спровоцировало?</h2>
              <TriggerSelector selected={selectedTrigger} onSelect={setSelectedTrigger} />
            </div>

            {/* Method & Site */}
            <div className="mx-4 glass rounded-2xl p-4 space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Способ</p>
                <div className="flex gap-2">
                  {METHODS.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => setMethod(m.code)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        method === m.code
                          ? 'bg-usnee-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Место</p>
                <div className="grid grid-cols-4 gap-2">
                  {SITES.map((s) => (
                    <button
                      key={s.code}
                      onClick={() => setSite(s.code)}
                      className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                        site === s.code
                          ? 'bg-pink-500/80 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Объём (мл)</p>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-usnee-400 focus:outline-none"
                />
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Заметка (опционально)</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Что чувствовал..."
                  rows={2}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-usnee-400 focus:outline-none resize-none text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 space-y-3">
              <button
                onClick={() => canRecord && setShowRecordConfirm(true)}
                disabled={!canRecord || isLoading}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Syringe size={20} />
                {isLoading ? 'Запись...' : '💉 Записать'}
              </button>

              <button
                onClick={() => setShowBreathing(true)}
                className="w-full py-3 bg-white/5 rounded-2xl font-medium text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Wind size={18} />
                Дыхательное упражнение
              </button>

              <p className="text-center text-gray-500 text-sm">
                Мы не судим, мы рядом 💜
              </p>
            </div>

            {/* Recent Achievements */}
            {user && user.recent_achievements?.length > 0 && (
              <div className="px-4 pb-6">
                <h3 className="text-gray-400 text-sm mb-3">Последние ачивки</h3>
                <div className="space-y-2">
                  {user.recent_achievements.slice(0, 3).map((ach) => (
                    <IronicBadge key={ach.code} achievement={ach} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold text-white px-6 mb-4">История</h2>
            <HistoryList
              history={history}
              hasMore={hasMore}
              onLoadMore={loadMoreHistory}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white mb-4">Настройки</h2>

            <div className="glass rounded-2xl p-4">
              <h3 className="font-semibold text-white mb-2">О приложении</h3>
              <p className="text-gray-400 text-sm">
                USNEE — инструмент harm reduction. Мы не заменяем медицинскую помощь и не даём оценок.
              </p>
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="font-semibold text-white mb-2">Конфиденциальность</h3>
              <p className="text-gray-400 text-sm">
                Все данные шифруются. Никаких следов в Telegram.
              </p>
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="font-semibold text-white mb-2">Экстренная помощь</h3>
              <p className="text-gray-400 text-sm mb-3">
                Если ты чувствуешь, что плохо — нажми красную кнопку в правом нижнем углу.
              </p>
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Heart size={16} />
                <span>Ты не один. Мы рядом.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-usnee-900/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center py-2 px-6 rounded-2xl transition-colors ${
                  isActive ? 'text-usnee-400' : 'text-gray-500'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Record Confirmation Modal */}
      <AnimatePresence>
        {showRecordConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowRecordConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-usnee-800 rounded-3xl p-6 w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-gray-300 mb-6">
                Записать инъекцию?
                <br />
                <span className="text-sm text-gray-500">
                  {METHODS.find((m) => m.code === method)?.label} · {volume} мл · {SITES.find((s) => s.code === site)?.label}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRecordConfirm(false)}
                  className="flex-1 py-3 bg-white/5 rounded-2xl text-gray-300 hover:bg-white/10"
                >
                  Отмена
                </button>
                <button
                  onClick={handleRecord}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-usnee-500 rounded-2xl text-white font-bold hover:bg-usnee-400 disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Записать'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
};
