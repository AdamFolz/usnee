import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, History, Settings, Home, Wind } from 'lucide-react';
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

// Pages
import { SafetyGuide } from '@/pages/SafetyGuide';
import { StatsPage } from '@/pages/StatsPage';
import { Achievements } from '@/pages/Achievements';
import { Settings as SettingsPage } from '@/pages/Settings';
import { ExportData } from '@/pages/ExportData';
import { Faq } from '@/pages/Faq';
import { Support } from '@/pages/Support';
import { NotificationSettings } from '@/pages/NotificationSettings';

type Tab = 'home' | 'history' | 'settings';
type Page = Tab | 'safety' | 'stats' | 'achievements' | 'export' | 'faq' | 'support' | 'notifications';

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

// All possible achievements
const ALL_ACHIEVEMENTS = [
  { code: 'first_log', title: 'Первый шаг', description: 'Первая запись в дневнике', icon: '📝', category: 'neutral' as const, xp_reward: 10 },
  { code: '24h_interval', title: '24 часа', description: 'Соблюдён 24-часовой интервал', icon: '⏰', category: 'positive' as const, xp_reward: 25 },
  { code: '7_days', title: 'Неделя', description: '7 дней без передозировок', icon: '📅', category: 'positive' as const, xp_reward: 50 },
  { code: '30_days', title: 'Месяц', description: '30 дней без передозировок', icon: '🏆', category: 'positive' as const, xp_reward: 100 },
  { code: 'filter_master', title: 'Фильтрую', description: 'Использован фильтр 5 раз', icon: '🧪', category: 'positive' as const, xp_reward: 30 },
  { code: 'rotation_pro', title: 'Ротатор', description: 'Ротация мест — 5 разных за неделю', icon: '🔄', category: 'positive' as const, xp_reward: 40 },
  { code: 'breathing', title: 'Дышу', description: 'Выполнено дыхательное упражнение', icon: '🌬️', category: 'positive' as const, xp_reward: 15 },
  { code: 'note_taker', title: 'Дневник', description: '10 заметок к записям', icon: '📖', category: 'neutral' as const, xp_reward: 20 },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [page, setPage] = useState<Page>('home');
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

  // Navigation helpers
  const goTo = (p: Page) => setPage(p);
  const goBack = () => {
    if (page === 'safety' || page === 'stats' || page === 'achievements') {
      setPage('home');
    } else if (page === 'export' || page === 'faq' || page === 'support' || page === 'notifications') {
      setPage('settings');
    } else {
      setPage('home');
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(tab);
  };

  // Page content renderer
  const renderPage = () => {
    switch (page) {
      case 'safety':
        return <SafetyGuide onBack={goBack} />;
      case 'stats':
        return <StatsPage stats={stats} onBack={goBack} />;
      case 'achievements':
        return (
          <Achievements
            achievements={ALL_ACHIEVEMENTS}
            unlockedCodes={user?.recent_achievements?.map((a) => a.code) ?? []}
            onBack={goBack}
          />
        );
      case 'export':
        return <ExportData onBack={goBack} />;
      case 'faq':
        return <Faq onBack={goBack} />;
      case 'support':
        return <Support onBack={goBack} />;
      case 'notifications':
        return <NotificationSettings onBack={goBack} />;
      default:
        return null;
    }
  };

  const isTabPage = page === 'home' || page === 'history' || page === 'settings';

  return (
    <div className="min-h-screen pb-20 bg-tg-bg">
      <ErrorToast message={error} onDismiss={clearError} />
      <AchievementPopup
        achievement={lastAchievement}
        visible={showAchievement}
        onDismiss={dismissAchievement}
      />
      <BreathingExercise isOpen={showBreathing} onClose={() => setShowBreathing(false)} />
      <EmergencyHelp />

      {/* Non-tab pages overlay */}
      <AnimatePresence>
        {!isTabPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-tg-bg"
          >
            {renderPage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab pages */}
      {isTabPage && (
        <>
          {/* Header */}
          <header className="p-6 text-center">
            <h1 className="text-3xl font-bold text-gradient">USNEE</h1>
            <p className="text-tg-text-secondary mt-2 text-sm">Без осуждения, только факты</p>
            {user && (
              <p className="text-tg-text-tertiary text-xs mt-1">
                {user.first_name || 'Аноним'} · Уровень {user.level}
              </p>
            )}
          </header>

          <AnimatePresence mode="wait">
            {page === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <StatsCard stats={stats} />

                {/* Quick links */}
                <div className="px-4 flex gap-3">
                  <button onClick={() => goTo('safety')} className="flex-1 card card-hover text-center py-3">
                    <span className="text-2xl mb-1 block">🛡️</span>
                    <span className="text-sm text-tg-text-secondary">Безопасность</span>
                  </button>
                  <button onClick={() => goTo('stats')} className="flex-1 card card-hover text-center py-3">
                    <span className="text-2xl mb-1 block">📊</span>
                    <span className="text-sm text-tg-text-secondary">Статистика</span>
                  </button>
                  <button onClick={() => goTo('achievements')} className="flex-1 card card-hover text-center py-3">
                    <span className="text-2xl mb-1 block">🏅</span>
                    <span className="text-sm text-tg-text-secondary">Ачивки</span>
                  </button>
                </div>

                {/* Trigger Selection */}
                <div>
                  <h2 className="text-center text-tg-text-secondary mb-2">Что спровоцировало?</h2>
                  <TriggerSelector selected={selectedTrigger} onSelect={setSelectedTrigger} />
                </div>

                {/* Method & Site */}
                <div className="mx-4 card space-y-4">
                  <div>
                    <p className="text-tg-text-secondary text-sm mb-2">Способ</p>
                    <div className="flex gap-2">
                      {METHODS.map((m) => (
                        <button
                          key={m.code}
                          onClick={() => setMethod(m.code)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                            method === m.code
                              ? 'bg-tg-primary text-white'
                              : 'bg-tg-bg-secondary text-tg-text-secondary hover:bg-tg-separator'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-tg-text-secondary text-sm mb-2">Место</p>
                    <div className="grid grid-cols-4 gap-2">
                      {SITES.map((s) => (
                        <button
                          key={s.code}
                          onClick={() => setSite(s.code)}
                          className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                            site === s.code
                              ? 'bg-tg-primary/80 text-white'
                              : 'bg-tg-bg-secondary text-tg-text-secondary hover:bg-tg-separator'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-tg-text-secondary text-sm mb-2">Объём (мл)</p>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <p className="text-tg-text-secondary text-sm mb-2">Заметка (опционально)</p>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Что чувствовал..."
                      rows={2}
                      className="input resize-none text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 space-y-3">
                  <button
                    onClick={() => canRecord && setShowRecordConfirm(true)}
                    disabled={!canRecord || isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Syringe size={20} />
                    {isLoading ? 'Запись...' : '💉 Записать'}
                  </button>

                  <button
                    onClick={() => setShowBreathing(true)}
                    className="btn-secondary w-full"
                  >
                    <Wind size={18} />
                    Дыхательное упражнение
                  </button>

                  <p className="text-center text-tg-text-tertiary text-sm">
                    Мы не судим, мы рядом 💜
                  </p>
                </div>

                {/* Recent Achievements */}
                {user && user.recent_achievements?.length > 0 && (
                  <div className="px-4 pb-6">
                    <h3 className="text-tg-text-secondary text-sm mb-3">Последние ачивки</h3>
                    <div className="space-y-2">
                      {user.recent_achievements.slice(0, 3).map((ach) => (
                        <IronicBadge key={ach.code} achievement={ach} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {page === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-xl font-bold text-tg-text px-6 mb-4">История</h2>
                <HistoryList
                  history={history}
                  hasMore={hasMore}
                  onLoadMore={loadMoreHistory}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {page === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <SettingsPage
                  onBack={() => handleTabChange('home')}
                  onNavigate={(p) => goTo(p as Page)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-tg-bg/90 backdrop-blur-lg border-t border-tg-separator">
            <div className="flex justify-around py-2 safe-bottom">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex flex-col items-center py-2 px-6 rounded-2xl transition-colors ${
                      isActive ? 'text-tg-primary' : 'text-tg-text-tertiary'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-xs mt-1">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}

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
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-tg-text-secondary mb-6">
                Записать инъекцию?
                <br />
                <span className="text-sm text-tg-text-tertiary">
                  {METHODS.find((m) => m.code === method)?.label} · {volume} мл · {SITES.find((s) => s.code === site)?.label}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRecordConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
                <button
                  onClick={handleRecord}
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? '...' : 'Записать'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
