import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ExpandableCard from '@/components/common/ExpandableCard';
import { FAQ_ITEMS } from '@/lib/info-content';

export default function FaqPage() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Вопросы и ответы" icon={HelpCircle} />

      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <ExpandableCard title={item.question} icon="❓">
              <p className="text-sm text-tg-text-secondary leading-relaxed">{item.answer}</p>
            </ExpandableCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}