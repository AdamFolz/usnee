import { motion } from 'framer-motion';
import { Phone, Heart, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { EMERGENCY_CONTACTS, HELP_ORGANIZATIONS } from '@/lib/info-content';

export default function HelpResources() {
  return (
    <div className="px-4 pt-4">
      <PageHeader title="Контакты помощи" icon={Heart} />

      <div className="space-y-4">
        {/* Emergency contacts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xs font-semibold text-tg-danger uppercase tracking-wide mb-2 px-1">
            Экстренные службы
          </h2>
          <div className="space-y-2">
            {EMERGENCY_CONTACTS.map((contact, i) => (
              <motion.a
                key={i}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card flex items-center gap-3 bg-tg-danger/5 border-tg-danger/20 active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-tg-danger/15 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-tg-danger" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-tg-text">{contact.name}</p>
                  <p className="text-xs text-tg-text-secondary">{contact.description}</p>
                </div>
                <span className="text-xl font-bold text-tg-danger">{contact.number}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Organizations */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-2 px-1">
            Организации и горячие линии
          </h2>
          <div className="space-y-2">
            {HELP_ORGANIZATIONS.map((org, i) => (
              <motion.a
                key={i}
                href={`tel:${org.contact}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="card flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-tg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-tg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-tg-text">{org.name}</p>
                  <p className="text-xs text-tg-text-secondary leading-snug">{org.description}</p>
                  <p className="text-sm text-tg-primary font-medium mt-0.5">{org.contact}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-tg-text-secondary shrink-0" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="card bg-tg-primary/5 border-tg-primary/20 text-center">
            <p className="text-sm text-tg-text leading-relaxed">
              Обращение за помощью — это признак силы, а не слабости.
              Вы не одни.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}