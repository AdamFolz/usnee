import { motion } from 'framer-motion';
import { Pill, AlertTriangle, ShieldCheck, Phone } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ExpandableCard from '@/components/common/ExpandableCard';
import { SUBSTANCES } from '@/lib/substances';

export default function SubstancesPage() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Справочник веществ" icon={Pill} />

      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-tg-warning/5 border-tg-warning/20"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-tg-warning shrink-0 mt-0.5" />
            <p className="text-xs text-tg-text-secondary leading-relaxed">
              Информация носит образовательный характер и предназначена для снижения вреда.
              При экстренных ситуациях звоните <span className="text-tg-warning font-semibold">103</span>.
            </p>
          </div>
        </motion.div>

        {SUBSTANCES.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}
          >
            <ExpandableCard title={sub.name} icon={sub.icon} subtitle={sub.category}>
              <div className="space-y-4">
                <p className="text-sm text-tg-text leading-relaxed">{sub.description}</p>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-tg-danger" />
                    <p className="text-xs font-semibold text-tg-danger uppercase tracking-wide">Риски</p>
                  </div>
                  <ul className="space-y-1">
                    {sub.risks.map((risk, idx) => (
                      <li key={idx} className="text-sm text-tg-text-secondary flex items-start gap-2">
                        <span className="text-tg-danger mt-0.5">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-tg-success" />
                    <p className="text-xs font-semibold text-tg-success uppercase tracking-wide">Снижение вреда</p>
                  </div>
                  <ul className="space-y-1">
                    {sub.harmReduction.map((tip, idx) => (
                      <li key={idx} className="text-sm text-tg-text-secondary flex items-start gap-2">
                        <span className="text-tg-success mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-2">
                    Признаки передозировки
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.overdoseSigns.map((sign, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-tg-danger/10 text-tg-danger text-xs font-medium"
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-tg-bg rounded-xl p-3 flex items-start gap-2">
                  <Phone className="w-4 h-4 text-tg-danger shrink-0 mt-0.5" />
                  <p className="text-xs text-tg-text leading-relaxed">{sub.emergencyAction}</p>
                </div>
              </div>
            </ExpandableCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}