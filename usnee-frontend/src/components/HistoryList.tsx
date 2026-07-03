import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Syringe, MapPin, Clock } from 'lucide-react';
import type { Injection } from '@/types';

interface Props {
  history: Injection[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  onItemClick?: (injection: Injection) => void;
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
  intravenous: 'В/в',
  intramuscular: 'В/м',
  subcutaneous: 'П/к',
};

export const HistoryList: React.FC<Props> = ({ history, hasMore, onLoadMore, isLoading, onItemClick }) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (history.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16 text-tg-text-tertiary">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass flex items-center justify-center">
          <Syringe size={32} className="opacity-30" />
        </div>
        <p className="text-lg">История пока пуста</p>
        <p className="text-sm mt-2">Записи появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4">
      {history.map((inj, idx) => (
        <motion.button
          key={inj.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onItemClick?.(inj)}
          className={`w-full text-left glass p-4 card-hover ${inj.is_cancelled ? 'opacity-40' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tg-primary/15 flex items-center justify-center shrink-0">
                <Syringe size={18} className="text-tg-primary" />
              </div>
              <div>
                <p className="font-semibold text-tg-text">
                  {METHOD_LABELS[inj.method] || inj.method} · {inj.volume_ml} мл
                </p>
                <p className="text-tg-text-secondary text-sm flex items-center gap-1 mt-0.5">
                  <MapPin size={12} />
                  {SITE_LABELS[inj.site] || inj.site}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-tg-text-tertiary text-xs flex items-center justify-end gap-1">
                <Clock size={12} />
                {format(parseISO(inj.injected_at), 'd MMM', { locale: ru })}
              </p>
              <p className="text-tg-text-tertiary text-xs mt-0.5">
                {format(parseISO(inj.injected_at), 'HH:mm', { locale: ru })}
              </p>
            </div>
          </div>

          {inj.trigger && (
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-tg-bg-secondary/50 text-xs text-tg-text-secondary font-medium">
                {inj.trigger}
              </span>
            </div>
          )}

          {inj.trigger_note && (
            <p className="mt-2 text-sm text-tg-text-tertiary italic line-clamp-2">{inj.trigger_note}</p>
          )}

          {inj.is_cancelled && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-tg-danger" />
              <p className="text-xs text-tg-danger font-medium">Отменена</p>
            </div>
          )}
        </motion.button>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="py-6 text-center">
          <div className="inline-block w-6 h-6 border-2 border-tg-primary/30 border-t-tg-primary rounded-full animate-spin" />
        </div>
      )}

      {isLoading && history.length === 0 && (
        <div className="py-12 text-center text-tg-text-tertiary">Загрузка...</div>
      )}
    </div>
  );
};
