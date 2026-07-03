import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Achievement } from '@/types';
import { IronicBadge } from './IronicBadge';

interface Props {
  achievement: Achievement | null;
  visible: boolean;
  onDismiss: () => void;
}

export const AchievementPopup: React.FC<Props> = ({ achievement, visible, onDismiss }) => {
  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card text-center relative">
              <button
                onClick={onDismiss}
                className="absolute top-4 right-4 text-tg-text-secondary hover:text-tg-text transition-colors"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                {achievement.icon}
              </motion.div>

              <h2 className="text-2xl font-bold text-gradient mb-2">
                Новая ачивка!
              </h2>

              <IronicBadge achievement={achievement} isNew />

              <button
                onClick={onDismiss}
                className="mt-6 btn-primary"
              >
                Круто!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
