import { motion } from 'framer-motion';
import { ShieldCheck, Check, X, Phone } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { SAFETY_DO, SAFETY_DONT } from '@/lib/info-content';

export default function SafetyGuide() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Правила безопасности" icon={ShieldCheck} />

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card bg-tg-success/5 border-tg-success/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-tg-success" />
              <h2 className="font-bold text-tg-text">Памятка безопасности</h2>
            </div>
            <p className="text-sm text-tg-text-secondary">
              Следование этим правилам значительно снижает риски для здоровья.
            </p>
          </div>
        </motion.div>

        {/* Do's */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-xs font-semibold text-tg-success uppercase tracking-wide mb-2 px-1">
            ✓ Делайте
          </h2>
          <div className="space-y-2">
            {SAFETY_DO.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className="card flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-tg-success/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-tg-success" />
                </div>
                <p className="text-sm text-tg-text">{rule}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Don'ts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xs font-semibold text-tg-danger uppercase tracking-wide mb-2 px-1">
            ✗ Не делайте
          </h2>
          <div className="space-y-2">
            {SAFETY_DONT.map((rule, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="card flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-tg-danger/15 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-tg-danger" />
                </div>
                <p className="text-sm text-tg-text">{rule}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="card bg-tg-danger/5 border-tg-danger/20 text-center">
            <Phone className="w-6 h-6 text-tg-danger mx-auto mb-2" />
            <p className="text-sm font-medium text-tg-text mb-2">При передозировке</p>
            <p className="text-xs text-tg-text-secondary mb-3">
              Вызовите скорую, используйте налоксон, не оставляйте человека одного.
            </p>
            <a href="tel:103" className="btn-danger w-full">Скорая помощь — 103</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}