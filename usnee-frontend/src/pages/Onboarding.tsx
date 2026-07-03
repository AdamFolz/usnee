import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Sparkles,
    title: 'Добро пожаловать в USNEE',
    description: 'Безопасный трекер для контроля использования. Без осуждения — только факты и поддержка.',
    color: 'from-tg-primary to-usnee-500',
  },
  {
    icon: Syringe,
    title: 'Отслеживай использование',
    description: 'Записывай каждую инъекцию: способ, место, объём и триггер. Получай статистику и аналитику.',
    color: 'from-usnee-500 to-usnee-300',
  },
  {
    icon: Shield,
    title: 'Будь в безопасности',
    description: 'Гид по harm reduction, ротация мест, правила гигиены и признаки передозировки — всегда под рукой.',
    color: 'from-tg-success to-teal-400',
  },
  {
    icon: Heart,
    title: 'Ты не один',
    description: 'Экстренная помощь в один тап. Горячие линии, группы поддержки и дыхательные упражнения.',
    color: 'from-tg-danger to-orange-400',
  },
];

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-tg-bg flex flex-col"
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 24 : 8,
              backgroundColor: i <= step ? '#0a84ff' : 'rgba(255,255,255,0.2)',
            }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center"
          >
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className={`w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center mb-8 shadow-2xl`}
            >
              <Icon size={48} className="text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-tg-text mb-4">{current.title}</h1>
            <p className="text-tg-text-secondary text-lg leading-relaxed">{current.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="p-8 pb-12">
        {isLast ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="btn-primary w-full text-lg py-4"
          >
            Начать
            <ArrowRight size={20} />
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary w-full text-lg py-4"
            >
              Далее
              <ArrowRight size={20} />
            </button>
          </div>
        )}
        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full text-center text-tg-text-tertiary text-sm mt-4 hover:text-tg-text-secondary transition-colors"
          >
            Пропустить
          </button>
        )}
      </div>
    </motion.div>
  );
};
