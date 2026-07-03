import React, { useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Syringe, MapPin, Clock, MessageSquare } from 'lucide-react';
import type { Injection } from '@/types';

interface Props {
  history: Injection[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
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

export const HistoryList: React.FC<Props> = ({ history, hasMore, onLoadMore, isLoading }) => {
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
      <div className="text-center py-12 text-gray-500">
        <Syringe size={48} className="mx-auto mb-4 opacity-30" />
        <p>История пока пуста</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4">
      {history.map((inj) => (
        <div
          key={inj.id}
          className={`glass rounded-2xl p-4 ${inj.is_cancelled ? 'opacity-50' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sekov-500/20 rounded-xl">
                <Syringe size={18} className="text-sekov-400" />
              </div>
              <div>
                <p className="font-medium text-white">
                  {METHOD_LABELS[inj.method] || inj.method} · {inj.volume_ml} мл
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <MapPin size={12} />
                  {SITE_LABELS[inj.site] || inj.site}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Clock size={12} />
              {format(parseISO(inj.injected_at), 'd MMM, HH:mm', { locale: ru })}
            </p>
          </div>

          {inj.trigger && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <MessageSquare size={14} />
              <span>Триггер: {inj.trigger}</span>
            </div>
          )}

          {inj.trigger_note && (
            <p className="mt-1 text-sm text-gray-500 italic">{inj.trigger_note}</p>
          )}

          {inj.is_cancelled && (
            <p className="mt-2 text-xs text-red-400">Отменена</p>
          )}
        </div>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center">
          <div className="inline-block w-6 h-6 border-2 border-sekov-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isLoading && history.length === 0 && (
        <div className="py-12 text-center text-gray-500">Загрузка...</div>
      )}
    </div>
  );
};
