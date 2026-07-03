import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Download, Shield, HelpCircle, MessageCircle, Info, ChevronRight, Trash2 } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const MENU_ITEMS = [
  { icon: Bell, label: 'Уведомления', page: 'notifications' },
  { icon: Download, label: 'Экспорт данных', page: 'export' },
  { icon: Shield, label: 'Безопасность', page: 'safety' },
  { icon: HelpCircle, label: 'FAQ', page: 'faq' },
  { icon: MessageCircle, label: 'Поддержка', page: 'support' },
  { icon: Info, label: 'О приложении', page: 'about' },
];

export const Settings: React.FC<Props> = ({ onBack, onNavigate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        <h1 className="text-xl font-bold text-tg-text">Настройки</h1>
      </div>

      <div className="p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="w-full flex items-center gap-4 p-4 bg-tg-bg-elevated rounded-2xl hover:bg-tg-bg-secondary transition-colors text-left"
            >
              <Icon size={22} className="text-tg-primary" />
              <span className="flex-1 text-tg-text">{item.label}</span>
              <ChevronRight size={18} className="text-tg-text-tertiary" />
            </button>
          );
        })}

        <div className="pt-6">
          <p className="text-tg-danger text-xs font-medium mb-2 px-2">ОПАСНАЯ ЗОНА</p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-4 p-4 bg-tg-danger/5 border border-tg-danger/10 rounded-2xl hover:bg-tg-danger/10 transition-colors text-left"
          >
            <Trash2 size={22} className="text-tg-danger" />
            <span className="text-tg-danger">Удалить все данные</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
              <Trash2 size={48} className="text-tg-danger mx-auto mb-4" />
              <h2 className="text-xl font-bold text-tg-text mb-2">Удалить все данные?</h2>
              <p className="text-tg-text-secondary text-sm mb-6">Это действие нельзя отменить. Вся история, ачивки и статистика будут безвозвратно удалены.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">Отмена</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-danger flex-1">Удалить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
