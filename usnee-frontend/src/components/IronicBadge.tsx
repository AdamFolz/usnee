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
      className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{achievement.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
        </div>
      </div>

      {isNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full"
        >
          NEW!
        </motion.div>
      )}
    </motion.div>
  );
};
