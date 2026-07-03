import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Phone, HelpCircle, LifeBuoy, Pill } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { INFO_CENTER_TIPS } from '@/lib/info-content';

const LINKS = [
  { to: '/safety-guide', icon: ShieldCheck, label: 'Правила безопасности', color: 'text-tg-success' },
  { to: '/help-resources', icon: Phone, label: 'Контакты помощи', color: 'text-tg-danger' },
  { to: '/substances', icon: Pill, label: 'Справочник веществ', color: 'text-tg-primary' },
  { to: '/faq', icon: HelpCircle, label: 'Вопросы и ответы', color: 'text-tg-warning' },
  { to: '/support', icon: LifeBuoy, label: 'Поддержка', color: 'text-tg-primary' },
];

export default function InfoCenter() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Инфо-центр" icon={Info} />

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-2">
            {INFO_CENTER_TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="card"
              >
                <span className="text-2xl mb-2 block">{tip.icon}</span>
                <p className="font-semibold text-tg-text text-sm mb-1">{tip.title}</p>
                <p className="text-xs text-tg-text-secondary leading-snug">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-2 px-1">
            Разделы
          </h2>
          <div className="space-y-2">
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="card flex items-center gap-3 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-tg-bg flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <span className="font-medium text-tg-text flex-1">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="card bg-tg-danger/5 border-tg-danger/20 text-center">
            <p className="text-xs text-tg-text-secondary mb-1">Экстренная связь</p>
            <a href="tel:103" className="text-2xl font-bold text-tg-danger">103</a>
            <p className="text-xs text-tg-text-secondary mt-1">Скорая помощь</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}