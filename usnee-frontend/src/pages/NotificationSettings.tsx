import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Clock, Syringe, ToggleLeft, ToggleRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const NotificationSettings: React.FC<Props> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    dailyReminder: true,
    intervalAlert: true,
    achievementNotif: true,
    emergencyAlert: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: 'dailyReminder' as const, icon: Clock, label: 'Ежедневное напоминание', desc: 'Напоминание записать инъекцию' },
    { key: 'intervalAlert' as const, icon: Syringe, label: 'Оповещение об интервале', desc: 'Предупреждение при частом использовании' },
    { key: 'achievementNotif' as const, icon: Bell, label: 'Новые ачивки', desc: 'Уведомление при получении достижения' },
    { key: 'emergencyAlert' as const, icon: Bell, label: 'Экстренные оповещения', desc: 'Важные обновления безопасности' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-tg-bg pb-20"
    >
      <div className="flex items-center gap-4 p-4 border-b border-tg-separator">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-tg-bg-elevated transition-colors">
          <ArrowLeft size={24} className="text-tg-text" />
        </button>
        <h1 className="text-xl font-bold text-tg-text">Уведомления</h1>
      </div>

      <div className="p-4 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const enabled = settings[item.key];
          return (
            <div key={item.key} className="card flex items-center gap-4">
              <Icon size={22} className="text-tg-primary shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-tg-text">{item.label}</p>
                <p className="text-tg-text-secondary text-sm">{item.desc}</p>
              </div>
              <button onClick={() => toggle(item.key)}>
                {enabled ? (
                  <ToggleRight size={32} className="text-tg-primary" />
                ) : (
                  <ToggleLeft size={32} className="text-tg-text-tertiary" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
