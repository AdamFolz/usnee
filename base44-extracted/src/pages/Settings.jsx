import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Bell, Moon, User, ChevronRight, BellRing } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useTelegram } from '@/hooks/useTelegram';

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

export default function SettingsPage() {
  const { user } = useTelegram();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setNotifications(localStorage.getItem('usnee_notifications') !== 'false');
    setSoundEnabled(localStorage.getItem('usnee_sound') !== 'false');
  }, []);

  const toggleNotifications = (val) => {
    setNotifications(val);
    localStorage.setItem('usnee_notifications', String(val));
  };

  const toggleSound = (val) => {
    setSoundEnabled(val);
    localStorage.setItem('usnee_sound', String(val));
  };

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Настройки" icon={Settings} />

      <div className="space-y-4">
        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-tg-text-secondary" />
              <span className="text-xs text-tg-text-secondary uppercase tracking-wide">Аккаунт</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-tg-primary/15 flex items-center justify-center text-lg font-bold text-tg-primary">
                {(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-tg-text">
                  {user?.first_name} {user?.last_name || ''}
                </p>
                <p className="text-sm text-tg-text-secondary">
                  @{user?.username || 'пользователь'}
                </p>
                {user?.id && (
                  <p className="text-xs text-tg-text-secondary mt-0.5">ID: {user.id}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-tg-text-secondary" />
              <span className="text-xs text-tg-text-secondary uppercase tracking-wide">Уведомления</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-tg-text">Push-уведомления</p>
                  <p className="text-xs text-tg-text-secondary">Основные уведомления</p>
                </div>
                <Toggle checked={notifications} onChange={toggleNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-tg-text">Звук</p>
                  <p className="text-xs text-tg-text-secondary">Звуковое сопровождение</p>
                </div>
                <Toggle checked={soundEnabled} onChange={toggleSound} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-tg-text-secondary" />
              <span className="text-xs text-tg-text-secondary uppercase tracking-wide">Оформление</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-tg-text">Тёмная тема</p>
                <p className="text-xs text-tg-text-secondary">Оптимизирована для Telegram</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-tg-primary/10 text-tg-primary text-xs font-medium">
                Активна
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link to="/notification-settings" className="card flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-tg-primary/10 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-tg-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-tg-text">Настройка уведомлений</p>
              <p className="text-xs text-tg-text-secondary">Время и частота напоминаний</p>
            </div>
            <ChevronRight className="w-5 h-5 text-tg-text-secondary" />
          </Link>
        </motion.div>

        <p className="text-center text-xs text-tg-text-secondary py-2">USNEE v1.0 · Снижение вреда</p>
      </div>
    </div>
  );
}