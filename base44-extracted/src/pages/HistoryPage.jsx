import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, X, Pencil } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useHistory } from '@/hooks/useHistory';
import { useCancelInjection } from '@/hooks/useInjection';
import { METHOD_ICONS, TRIGGER_LABELS } from '@/lib/constants';

function getDateLabel(date) {
  if (isToday(date)) return 'Сегодня';
  if (isYesterday(date)) return 'Вчера';
  return format(date, 'd MMMM', { locale: ru });
}

function groupByDate(items) {
  const groups = {};
  const order = [];
  for (const item of items) {
    const date = new Date(item.injected_at);
    const key = format(date, 'yyyy-MM-dd');
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push(item);
  }
  return order.map((key) => ({
    key,
    label: getDateLabel(new Date(key + 'T00:00:00')),
    items: groups[key],
  }));
}

function CancelDialog({ open, onClose, onConfirm, isPending }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason || undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[90%] max-w-sm"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-tg-text">Отменить запись?</h3>
                <button
                  onClick={handleClose}
                  className="text-tg-text-secondary hover:text-tg-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-tg-text-secondary mb-4">
                Запись будет помечена как отменённая. Это действие нельзя
                отменить.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Причина (необязательно)..."
                rows={2}
                className="input resize-none mb-4"
                maxLength={500}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                  disabled={isPending}
                >
                  Нет
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn-danger flex-1"
                  disabled={isPending}
                >
                  {isPending ? 'Удаление...' : 'Отменить запись'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function HistoryPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useHistory();
  const cancelMutation = useCancelInjection();
  const [cancelTarget, setCancelTarget] = useState(null);

  const allItems = data?.pages?.flatMap((p) => p.items) || [];
  const grouped = groupByDate(allItems);

  const handleConfirmCancel = async (reason) => {
    if (!cancelTarget) return;
    try {
      await cancelMutation.mutateAsync({
        id: cancelTarget.id,
        reason,
      });
      setCancelTarget(null);
    } catch (e) {
      console.error('Cancel failed:', e);
    }
  };

  return (
    <div className="px-4 pt-4 space-y-4">
      <CancelDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        isPending={cancelMutation.isPending}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-24 mb-2" />
                  <div className="skeleton h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold text-tg-text mb-1">История пуста</p>
          <p className="text-sm text-tg-text-secondary">
            Записи появятся после первой инъекции
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.key}>
              <h2 className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-2 px-1">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((inj, i) => (
                  <motion.div
                    key={inj.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-tg-bg flex items-center justify-center text-lg shrink-0">
                      {METHOD_ICONS[inj.method] || '💉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-tg-text">
                        {inj.volume_ml} мл
                        {inj.trigger &&
                          ` · ${TRIGGER_LABELS[inj.trigger] || inj.trigger}`}
                      </p>
                      <p className="text-xs text-tg-text-secondary truncate">
                        {inj.site} ·{' '}
                        {format(new Date(inj.injected_at), 'HH:mm', {
                          locale: ru,
                        })}
                      </p>
                    </div>
                    <Link
                      to={`/edit-injection?id=${inj.id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-tg-text-secondary hover:text-tg-primary hover:bg-tg-primary/10 transition-colors shrink-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setCancelTarget(inj)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-tg-text-secondary hover:text-tg-danger hover:bg-tg-danger/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="w-4 h-4 border-2 border-tg-text-secondary/30 border-t-tg-text-secondary rounded-full animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Загрузить ещё
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}