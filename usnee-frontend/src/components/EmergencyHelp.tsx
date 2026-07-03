import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ExternalLink, AlertTriangle, X } from 'lucide-react';

interface Contact {
  name: string;
  phone?: string;
  url?: string;
  description: string;
}

const EMERGENCY_CONTACTS: Contact[] = [
  {
    name: 'Наркологическая помощь',
    phone: '103',
    description: 'Круглосуточно, бесплатно, анонимно',
  },
  {
    name: 'Телефон доверия',
    phone: '8-800-2000-122',
    description: 'Психологическая помощь 24/7',
  },
  {
    name: 'Группа взаимопомощи',
    url: 'https://t.me/anon_support_group',
    description: 'Анонимный чат поддержки',
  },
];

export const EmergencyHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-tg-danger/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-tg-danger transition-colors"
        aria-label="Экстренная помощь"
      >
        <AlertTriangle size={24} className="text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-md card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-tg-text">🆘 Экстренная помощь</h2>
                <button onClick={() => setIsOpen(false)} className="text-tg-text-secondary hover:text-tg-text transition-colors">
                  <X size={24} />
                </button>
              </div>

              <p className="text-tg-text-secondary text-sm mb-6">
                Ты не один. Если ты чувствуешь, что плохо — обратись. Это не стыдно.
              </p>

              <div className="space-y-3">
                {EMERGENCY_CONTACTS.map((contact) => (
                  <a
                    key={contact.name}
                    href={contact.phone ? `tel:${contact.phone}` : contact.url}
                    target={contact.url ? '_blank' : undefined}
                    rel={contact.url ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 bg-tg-bg-elevated rounded-2xl hover:bg-tg-bg-secondary transition-colors"
                  >
                    <div className="p-3 bg-tg-danger/10 rounded-xl">
                      {contact.phone ? (
                        <Phone size={20} className="text-tg-danger" />
                      ) : (
                        <MessageCircle size={20} className="text-tg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-tg-text">{contact.name}</h3>
                      <p className="text-tg-text-secondary text-sm">{contact.description}</p>
                    </div>
                    {contact.url && <ExternalLink size={16} className="text-tg-text-tertiary" />}
                  </a>
                ))}
              </div>

              <p className="text-tg-text-tertiary text-xs text-center mt-6">
                Все контакты анонимны. Мы не получаем информацию о звонках.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
