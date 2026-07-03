import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PHASES = [
  { label: 'Вдох', duration: 4000, scale: 1.5 },
  { label: 'Задержка', duration: 4000, scale: 1.5 },
  { label: 'Выдох', duration: 4000, scale: 1.0 },
  { label: 'Пауза', duration: 4000, scale: 1.0 },
];

export const BreathingExercise: React.FC<Props> = ({ isOpen, onClose }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, PHASES[phaseIndex].duration);

    return () => clearTimeout(timer);
  }, [phaseIndex, isRunning, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPhaseIndex(0);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [isOpen]);

  const phase = PHASES[phaseIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="card w-full max-w-sm text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-tg-text-secondary hover:text-tg-text transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-tg-text mb-2">Дыхательное упражнение</h2>
            <p className="text-tg-text-secondary text-sm mb-8">4-4-4-4. Следуй кругу.</p>

            <div className="relative flex items-center justify-center h-48 mb-8">
              <motion.div
                animate={{
                  scale: phase.scale,
                  opacity: phase.scale > 1 ? 0.6 : 0.3,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute w-32 h-32 bg-tg-primary/30 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  scale: phase.scale,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="relative w-32 h-32 bg-tg-primary rounded-full flex items-center justify-center"
              >
                <Wind size={32} className="text-white" />
              </motion.div>
            </div>

            <p className="text-2xl font-bold text-tg-primary">{phase.label}</p>
            <p className="text-tg-text-tertiary text-sm mt-2">
              {phaseIndex === 0 && 'Медленно вдохни через нос'}
              {phaseIndex === 1 && 'Задержи дыхание'}
              {phaseIndex === 2 && 'Медленно выдохни через рот'}
              {phaseIndex === 3 && 'Пауза перед следующим циклом'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
