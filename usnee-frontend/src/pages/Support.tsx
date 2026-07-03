import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Mail, Heart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const Support: React.FC<Props> = ({ onBack }) => {
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
        <h1 className="text-xl font-bold text-tg-text">Поддержка</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="card text-center">
          <Heart size={48} className="text-tg-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-tg-text mb-2">Мы рядом</h2>
          <p className="text-tg-text-secondary text-sm">
            Если у тебя есть вопросы, проблемы или просто нужно поговорить — напиши нам.
            Мы отвечаем в течение 24 часов.
          </p>
        </div>

        <a
          href="https://t.me/usnee_support"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-tg-bg-elevated rounded-2xl hover:bg-tg-bg-secondary transition-colors"
        >
          <MessageCircle size={24} className="text-tg-primary" />
          <div className="flex-1">
            <p className="font-semibold text-tg-text">Telegram</p>
            <p className="text-tg-text-secondary text-sm">@usnee_support</p>
          </div>
        </a>

        <a
          href="mailto:support@usnee.app"
          className="flex items-center gap-4 p-4 bg-tg-bg-elevated rounded-2xl hover:bg-tg-bg-secondary transition-colors"
        >
          <Mail size={24} className="text-tg-primary" />
          <div className="flex-1">
            <p className="font-semibold text-tg-text">Email</p>
            <p className="text-tg-text-secondary text-sm">support@usnee.app</p>
          </div>
        </a>

        <div className="card">
          <p className="text-tg-text-secondary text-sm text-center">
            USNEE — некоммерческий проект. Мы не собираем данные и не показываем рекламу.
            Если хочешь поддержать проект, поделись им с теми, кому он может помочь.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
