import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '@/types';

interface Props {
  achievement: Achievement;
  isNew?: boolean;
}

export const IronicBadge: React.FC<Props> = ({ achievement, isNew }) => {
  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="card relative"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{achievement.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-tg-text text-lg">{achievement.title}</h3>
          <p className="text-tg-text-secondary text-sm mt-1">{achievement.description}</p>
        </div>
      </div>

      {isNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 -right-2 bg-tg-warning text-black text-xs font-bold px-2 py-1 rounded-full"
        >
          NEW!
        </motion.div>
      )}
    </motion.div>
  );
};
