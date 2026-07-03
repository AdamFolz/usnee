import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const FAQS = [
  {
    q: 'Кто видит мои данные?',
    a: 'Никто, кроме вас. Все данные шифруются и хранятся анонимно. Мы не передаём информацию третьим лицам.',
  },
  {
    q: 'Можно ли использовать без Telegram?',
    a: 'Да, приложение работает и в браузере. Но для полной анонимности рекомендуем Telegram Mini App.',
  },
  {
    q: 'Что такое harm reduction?',
    a: 'Harm reduction — это подход, направленный на снижение вреда от использования ПАВ, а не на запрет. Мы не осуждаем, мы помогаем быть в безопасности.',
  },
  {
    q: 'Как удалить аккаунт?',
    a: 'В настройках есть раздел "Опасная зона" — там можно удалить все данные безвозвратно.',
  },
  {
    q: 'Приложение бесплатное?',
    a: 'Да, USNEE полностью бесплатен. Мы некоммерческий проект.',
  },
  {
    q: 'Что делать при передозировке?',
    a: 'Немедленно вызови скорую (103). Если есть налоксон — используй. Положи человека на бок и не оставляй одного.',
  },
];

export const Faq: React.FC<Props> = ({ onBack }) => {
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
        <h1 className="text-xl font-bold text-tg-text">FAQ</h1>
      </div>

      <div className="p-4 space-y-3">
        {FAQS.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
          >
            <div className="flex items-start gap-3">
              <HelpCircle size={20} className="text-tg-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-tg-text mb-1">{faq.q}</p>
                <p className="text-tg-text-secondary text-sm">{faq.a}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
