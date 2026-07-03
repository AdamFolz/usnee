import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, History, Settings, Home, Wind, User } from 'lucide-react';
import type { TriggerCode, InjectionMethod, InjectionSite, Injection } from '@/types';
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
import { ProfilePage } from '@/pages/ProfilePage';
import { CalendarView } from '@/pages/CalendarView';
import { Onboarding } from '@/pages/Onboarding';
import { InjectionDetail } from '@/pages/InjectionDetail';

type Tab = 'home' | 'history' | 'settings';
type Page = Tab | 'safety' | 'stats' | 'achievements' | 'export' | 'faq' | 'support' | 'notifications' | 'profile' | 'calendar' | 'onboarding' | 'injection_detail';

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
  const [selectedInjection, setSelectedInjection] = useState<Injection | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('usnee_onboarding_seen') === 'true';
  });

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

  const goTo = (p: Page) => setPage(p);
  const goBack = () => {
    if (page === 'injection_detail') {
      setPage('history');
      setSelectedInjection(null);
    } else if (['safety', 'stats', 'achievements', 'profile', 'calendar'].includes(page)) {
      setPage('home');
    } else if (['export', 'faq', 'support', 'notifications'].includes(page)) {
      setPage('settings');
    } else {
      setPage('home');
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(tab);
  };

  const handleInjectionClick = (injection: Injection) => {
    setSelectedInjection(injection);
    setPage('injection_detail');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('usnee_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    setPage('home');
  };

  // Show onboarding on first visit
  if (!hasSeenOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

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
      case 'profile':
        return (
          <ProfilePage
            user={user}
            stats={stats}
            onBack={goBack}
            onEdit={() => {}}
            onAchievements={() => goTo('achievements')}
          />
        );
      case 'calendar':
        return <CalendarView onBack={goBack} />;
      case 'injection_detail':
        return (
          <InjectionDetail
            injection={selectedInjection}
            onBack={goBack}
            onCancel={(id) => { console.log('cancel', id); }}
          />
        );
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
          {/* Glass Header */}
          <header className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-tg-primary/10 to-transparent" />
            <div className="relative p-6 text-center pt-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gradient">USNEE</h1>
              </div>
              <p className="text-tg-text-secondary text-sm">Без осуждения, только факты</p>
              {user && (
                <button
                  onClick={() => goTo('profile')}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-tg-text-secondary hover:text-tg-text transition-colors"
                >
                  <User size={16} />
                  {user.first_name || 'Аноним'} · Уровень {user.level}
                </button>
              )}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {page === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <StatsCard stats={stats} />

                {/* Quick links - glass style */}
                <div className="px-4">
                  <p className="label mb-3 px-1">Быстрый доступ</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => goTo('safety')} className="glass p-3 text-center card-hover">
                      <span className="text-2xl mb-1 block">🛡️</span>
                      <span className="text-xs text-tg-text-secondary">Гид</span>
                    </button>
                    <button onClick={() => goTo('stats')} className="glass p-3 text-center card-hover">
                      <span className="text-2xl mb-1 block">📊</span>
                      <span className="text-xs text-tg-text-secondary">Стат.</span>
                    </button>
                    <button onClick={() => goTo('calendar')} className="glass p-3 text-center card-hover">
                      <span className="text-2xl mb-1 block">📅</span>
                      <span className="text-xs text-tg-text-secondary">Кален.</span>
                    </button>
                    <button onClick={() => goTo('achievements')} className="glass p-3 text-center card-hover">
                      <span className="text-2xl mb-1 block">🏅</span>
                      <span className="text-xs text-tg-text-secondary">Ачивки</span>
                    </button>
                  </div>
                </div>

                {/* Trigger Selection */}
                <div>
                  <p className="label mb-3 px-5">Что спровоцировало?</p>
                  <TriggerSelector selected={selectedTrigger} onSelect={setSelectedTrigger} />
                </div>

                {/* Method & Site - glass form */}
                <div className="mx-4 glass space-y-4 p-4">
                  <div>
                    <p className="label mb-2">Способ</p>
                    <div className="flex gap-2">
                      {METHODS.map((m) => (
                        <button
                          key={m.code}
                          onClick={() => setMethod(m.code)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            method === m.code
                              ? 'bg-tg-primary text-white shadow-lg shadow-tg-primary/25'
                              : 'bg-tg-bg-secondary/50 text-tg-text-secondary hover:bg-tg-bg-secondary'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="label mb-2">Место</p>
                    <div className="grid grid-cols-4 gap-2">
                      {SITES.map((s) => (
                        <button
                          key={s.code}
                          onClick={() => setSite(s.code)}
                          className={`py-2 rounded-xl text-xs font-medium transition-all ${
                            site === s.code
                              ? 'bg-tg-primary/80 text-white shadow-md'
                              : 'bg-tg-bg-secondary/50 text-tg-text-secondary hover:bg-tg-bg-secondary'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="label mb-2">Объём (мл)</p>
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
                    <p className="label mb-2">Заметка (опционально)</p>
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
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => canRecord && setShowRecordConfirm(true)}
                    disabled={!canRecord || isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Syringe size={20} />
                    {isLoading ? 'Запись...' : '💉 Записать'}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowBreathing(true)}
                    className="btn-secondary w-full"
                  >
                    <Wind size={18} />
                    Дыхательное упражнение
                  </motion.button>

                  <p className="text-center text-tg-text-tertiary text-sm pt-2">
                    Мы не судим, мы рядом 💜
                  </p>
                </div>

                {/* Recent Achievements */}
                {user && user.recent_achievements?.length > 0 && (
                  <div className="px-4 pb-6">
                    <p className="label mb-3">Последние ачивки</p>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-bold text-tg-text px-6 mb-4">История</h2>
                <HistoryList
                  history={history}
                  hasMore={hasMore}
                  onLoadMore={loadMoreHistory}
                  isLoading={isLoading}
                  onItemClick={handleInjectionClick}
                />
              </motion.div>
            )}

            {page === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <SettingsPage
                  onBack={() => handleTabChange('home')}
                  onNavigate={(p) => goTo(p as Page)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Navigation - glass */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-tg-bg-glass/80 backdrop-blur-xl border-t border-tg-separator">
            <div className="flex justify-around py-2 safe-bottom">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex flex-col items-center py-2 px-6 rounded-2xl transition-colors ${
                      isActive ? 'text-tg-primary' : 'text-tg-text-tertiary'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-xs mt-1 font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </>
      )}

      {/* Record Confirmation Modal - glass */}
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
              className="glass w-full max-w-sm text-center p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-tg-primary to-usnee-500 flex items-center justify-center">
                <Syringe size={28} className="text-white" />
              </div>
              <p className="text-tg-text font-semibold text-lg mb-2">Записать инъекцию?</p>
              <p className="text-tg-text-secondary mb-6">
                {METHODS.find((m) => m.code === method)?.label} · {volume} мл · {SITES.find((s) => s.code === site)?.label}
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
