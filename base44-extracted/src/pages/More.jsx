import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Pill,
  Info,
  Trophy,
  Bell,
  Download,
  LifeBuoy,
  ShieldCheck,
  Phone,
  BellRing,
  HelpCircle,
} from 'lucide-react';

const PAGES = [
  { to: '/settings', icon: Settings, label: 'Настройки профиля', desc: 'Аккаунт, тема, уведомления' },
  { to: '/substances', icon: Pill, label: 'Справочник веществ', desc: 'Информация и снижение вреда' },
  { to: '/info-center', icon: Info, label: 'Инфо-центр', desc: 'Советы и экстренные контакты' },
  { to: '/achievements', icon: Trophy, label: 'Достижения', desc: 'Все награды и прогресс' },
  { to: '/reminders', icon: Bell, label: 'Напоминания', desc: 'Управление напоминаниями' },
  { to: '/export-data', icon: Download, label: 'Экспорт данных', desc: 'Скачать историю в CSV' },
  { to: '/support', icon: LifeBuoy, label: 'Поддержка', desc: 'Контакты и помощь' },
  { to: '/safety-guide', icon: ShieldCheck, label: 'Правила безопасности', desc: 'Памятка по безопасным инъекциям' },
  { to: '/help-resources', icon: Phone, label: 'Контакты помощи', desc: 'Экстренная помощь и организации' },
  { to: '/notification-settings', icon: BellRing, label: 'Настройка уведомлений', desc: 'Время и частота напоминаний' },
  { to: '/faq', icon: HelpCircle, label: 'Вопросы и ответы', desc: 'FAQ по приложению' },
];

export default function More() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {PAGES.map((page, i) => {
          const Icon = page.icon;
          return (
            <motion.div
              key={page.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={page.to}
                className="card flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-tg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-tg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-tg-text">{page.label}</p>
                  <p className="text-xs text-tg-text-secondary truncate">{page.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}