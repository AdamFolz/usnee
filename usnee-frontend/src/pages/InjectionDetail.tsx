import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Syringe, MapPin, Clock, MessageSquare, X, RotateCcw } from 'lucide-react';
import type { Injection } from '@/types';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  injection: Injection | null;
  onBack: () => void;
  onCancel?: (id: number) => void;
}

const SITE_LABELS: Record<string, string> = {
  left_arm: 'Левая рука',
  right_arm: 'Правая рука',
  left_leg: 'Левая нога',
  right_leg: 'Правая нога',
  abdomen: 'Живот',
  chest: 'Грудь',
  neck: 'Шея',
  other: 'Другое',
};

const METHOD_LABELS: Record<string, string> = {
  intravenous: 'В/в (внутривенно)',
  intramuscular: 'В/м (внутримышечно)',
  subcutaneous: 'П/к (подкожно)',
};

const TRIGGER_LABELS: Record<string, string> = {
  stress: 'Стресс',
  boredom: 'Скука',
  company: 'Компания',
  pain: 'Боль',
  habit: 'Привычка',
  celebration: 'Праздник',
  withdrawal: 'Ломка',
  experiment: 'Эксперимент',
  no_reason: 'Просто так',
};

export const InjectionDetail: React.FC<Props> = ({ injection, onBack, onCancel }) => {
  if (!injection) return null;

  const date = parseISO(injection.injected_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-tg-bg"
    >
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tg-primary/30 via-tg-bg to-tg-bg" />
        <div className="relative flex items-center justify-between p-4 pt-6">
          <button onClick={onBack} className="p-2 glass rounded-full">
            <ArrowLeft size={20} className="text-tg-text" />
          </button>
          {!injection.is_cancelled && onCancel && (
            <button
              onClick={() => onCancel(injection.id)}
              className="p-2 glass rounded-full text-tg-danger"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="relative text-center -mt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-tg-primary to-usnee-500 flex items-center justify-center shadow-lg"
          >
            <Syringe size={32} className="text-white" />
          </motion.div>
          <p className="text-tg-text-tertiary text-sm mt-3">
            {format(date, 'd MMMM yyyy, HH:mm', { locale: ru })}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 space-y-3">
        {/* Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-tg-primary/15 flex items-center justify-center">
            <Syringe size={24} className="text-tg-primary" />
          </div>
          <div>
            <p className="text-xs text-tg-text-secondary uppercase tracking-wider">Способ</p>
            <p className="text-lg font-semibold text-tg-text">{METHOD_LABELS[injection.method]}</p>
          </div>
        </motion.div>

        {/* Site */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-usnee-500/15 flex items-center justify-center">
            <MapPin size={24} className="text-usnee-400" />
          </div>
          <div>
            <p className="text-xs text-tg-text-secondary uppercase tracking-wider">Место</p>
            <p className="text-lg font-semibold text-tg-text">{SITE_LABELS[injection.site]}</p>
          </div>
        </motion.div>

        {/* Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-tg-success/15 flex items-center justify-center">
            <Clock size={24} className="text-tg-success" />
          </div>
          <div>
            <p className="text-xs text-tg-text-secondary uppercase tracking-wider">Объём</p>
            <p className="text-lg font-semibold text-tg-text">{injection.volume_ml} мл</p>
          </div>
        </motion.div>

        {/* Trigger */}
        {injection.trigger && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-tg-warning/15 flex items-center justify-center">
              <MessageSquare size={24} className="text-tg-warning" />
            </div>
            <div>
              <p className="text-xs text-tg-text-secondary uppercase tracking-wider">Триггер</p>
              <p className="text-lg font-semibold text-tg-text">{TRIGGER_LABELS[injection.trigger] || injection.trigger}</p>
            </div>
          </motion.div>
        )}

        {/* Note */}
        {injection.trigger_note && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-4"
          >
            <p className="text-xs text-tg-text-secondary uppercase tracking-wider mb-2">Заметка</p>
            <p className="text-tg-text italic">"{injection.trigger_note}"</p>
          </motion.div>
        )}

        {/* Cancelled badge */}
        {injection.is_cancelled && (
          <div className="glass p-4 flex items-center gap-3 border-tg-danger/20">
            <RotateCcw size={20} className="text-tg-danger" />
            <p className="text-tg-danger font-medium">Запись отменена</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
