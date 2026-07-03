import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export const ErrorToast: React.FC<Props> = ({ message, onDismiss }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className="bg-tg-danger/90 backdrop-blur-sm text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <AlertCircle size={20} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onDismiss} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
