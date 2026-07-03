import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import type { Achievement } from '@/types';

interface Props {
  achievements: Achievement[];
  unlockedCodes: string[];
  onBack: () => void;
}

export const Achievements: React.FC<Props> = ({ achievements, unlockedCodes, onBack }) => {
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
        <h1 className="text-xl font-bold text-tg-text">Достижения</h1>
      </div>

      <div className="p-4 space-y-3">
        {achievements.map((ach, idx) => {
          const isUnlocked = unlockedCodes.includes(ach.code);
          return (
            <motion.div
              key={ach.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`card flex items-center gap-4 ${isUnlocked ? '' : 'opacity-50'}`}
            >
              <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>{isUnlocked ? ach.icon : '🔒'}</div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isUnlocked ? 'text-tg-text' : 'text-tg-text-tertiary'}`}>{ach.title}</h3>
                <p className="text-tg-text-secondary text-sm">{ach.description}</p>
                <p className="text-usnee-400 text-xs mt-1">+{ach.xp_reward} XP</p>
              </div>
              {!isUnlocked && <Lock size={20} className="text-tg-text-tertiary" />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
