import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LifeBuoy, MessageCircle, HelpCircle, Mail, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

export default function SupportPage() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Поддержка" icon={LifeBuoy} />

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-tg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-tg-primary" />
            </div>
            <h2 className="font-bold text-tg-text mb-2">Мы здесь, чтобы помочь</h2>
            <p className="text-sm text-tg-text-secondary max-w-xs mx-auto">
              Если у вас есть вопросы или проблемы, свяжитесь с нами любым удобным способом.
            </p>
          </div>
        </motion.div>

        {/* Contact options */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="space-y-2">
            <a href="https://t.me/usnee_support" target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-tg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-tg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-tg-text">Чат поддержки</p>
                <p className="text-xs text-tg-text-secondary">@usnee_support в Telegram</p>
              </div>
              <ChevronRight className="w-5 h-5 text-tg-text-secondary" />
            </a>

            <a href="mailto:support@usnee.app" className="card flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-tg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-tg-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-tg-text">Email</p>
                <p className="text-xs text-tg-text-secondary">support@usnee.app</p>
              </div>
              <ChevronRight className="w-5 h-5 text-tg-text-secondary" />
            </a>

            <Link to="/faq" className="card flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-tg-warning/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-tg-warning" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-tg-text">Частые вопросы</p>
                <p className="text-xs text-tg-text-secondary">Возможно, ответ уже есть</p>
              </div>
              <ChevronRight className="w-5 h-5 text-tg-text-secondary" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card bg-tg-danger/5 border-tg-danger/20">
            <p className="text-sm font-medium text-tg-text mb-1">Экстренная ситуация?</p>
            <p className="text-xs text-tg-text-secondary mb-3">
              Если вам или кому-то рядом нужна срочная помощь, не ждите — звоните.
            </p>
            <a href="tel:103" className="btn-danger w-full text-center">
              Вызвать скорую — 103
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}