import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PageHeader from '@/components/common/PageHeader';
import { useHistory } from '@/hooks/useHistory';
import { useUpdateInjection } from '@/hooks/useUpdateInjection';
import { INJECTION_METHODS, COMMON_SITES, TRIGGERS, METHOD_ICONS } from '@/lib/constants';

export default function EditInjection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const injectionId = searchParams.get('id');
  const { data, isLoading } = useHistory();
  const updateMutation = useUpdateInjection();
  const [error, setError] = useState(null);

  const allItems = data?.pages?.flatMap((p) => p.items) || [];
  const injection = allItems.find((i) => i.id === injectionId);

  const [form, setForm] = useState({
    method: 'intravenous',
    site: '',
    volume_ml: '',
    trigger: '',
    note: '',
  });

  useEffect(() => {
    if (injection) {
      setForm({
        method: injection.method || 'intravenous',
        site: injection.site || '',
        volume_ml: injection.volume_ml?.toString() || '',
        trigger: injection.trigger || '',
        note: injection.note || '',
      });
    }
  }, [injection?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const volume = parseFloat(form.volume_ml);
    if (!volume || volume <= 0) {
      setError('Укажите корректный объём');
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: injectionId,
        data: {
          method: form.method,
          site: form.site,
          volume_ml: volume,
          trigger: form.trigger || undefined,
          note: form.note || undefined,
        },
      });
      navigate('/history');
    } catch (err) {
      setError(err.message || 'Не удалось сохранить');
    }
  };

  // No ID: show list to pick from
  if (!injectionId) {
    return (
      <div className="px-4 pt-4">
        <PageHeader title="Редактировать запись" icon={Pencil} />
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="skeleton h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm text-tg-text-secondary">Записей не найдено</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allItems.slice(0, 20).map((inj, i) => (
              <motion.button
                key={inj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/edit-injection?id=${inj.id}`)}
                className="card flex items-center gap-3 w-full text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-tg-bg flex items-center justify-center text-lg shrink-0">
                  {METHOD_ICONS[inj.method] || '💉'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-tg-text">{inj.volume_ml} мл</p>
                  <p className="text-xs text-tg-text-secondary truncate">
                    {inj.site} · {format(new Date(inj.injected_at), 'd MMM, HH:mm', { locale: ru })}
                  </p>
                </div>
                <Pencil className="w-4 h-4 text-tg-text-secondary shrink-0" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // With ID: show edit form
  if (isLoading) {
    return (
      <div className="px-4 pt-4">
        <PageHeader title="Редактирование" icon={Pencil} />
        <div className="space-y-3">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!injection) {
    return (
      <div className="px-4 pt-4">
        <PageHeader title="Редактирование" icon={Pencil} />
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-tg-text-secondary mb-4">Запись не найдена</p>
          <button onClick={() => navigate('/history')} className="btn-primary">
            К истории
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Редактирование" icon={Pencil} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Original timestamp */}
        <div className="card flex items-center gap-2">
          <Clock className="w-4 h-4 text-tg-text-secondary" />
          <span className="text-sm text-tg-text-secondary">
            {format(new Date(injection.injected_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
          </span>
        </div>

        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-tg-text-secondary mb-2">Метод</label>
          <div className="grid grid-cols-3 gap-2">
            {INJECTION_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setForm({ ...form, method: m.value })}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 ${
                  form.method === m.value
                    ? 'bg-tg-primary/15 border-tg-primary text-tg-primary'
                    : 'bg-tg-bg border-tg-border text-tg-text-secondary'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Site */}
        <div>
          <label className="block text-sm font-medium text-tg-text-secondary mb-2">Место</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COMMON_SITES.map((site) => (
              <button
                key={site}
                type="button"
                onClick={() => setForm({ ...form, site })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                  form.site === site
                    ? 'bg-tg-primary/15 border-tg-primary text-tg-primary'
                    : 'bg-tg-bg border-tg-border text-tg-text-secondary'
                }`}
              >
                {site}
              </button>
            ))}
          </div>
          <input
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
            placeholder="Или введите своё..."
            className="input"
            autoComplete="off"
          />
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm font-medium text-tg-text-secondary mb-2">Объём (мл)</label>
          <div className="relative">
            <input
              value={form.volume_ml}
              onChange={(e) => setForm({ ...form, volume_ml: e.target.value })}
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input pr-12"
              autoComplete="off"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-tg-text-secondary text-sm">мл</span>
          </div>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-tg-text-secondary mb-2">Триггер</label>
          <div className="grid grid-cols-3 gap-2">
            {TRIGGERS.map((t) => (
              <button
                key={t.code}
                type="button"
                onClick={() => setForm({ ...form, trigger: form.trigger === t.code ? '' : t.code })}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all active:scale-95 ${
                  form.trigger === t.code
                    ? 'bg-tg-primary/15 border-tg-primary text-tg-primary'
                    : 'bg-tg-bg border-tg-border text-tg-text-secondary'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-[10px] font-medium leading-tight text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-tg-text-secondary mb-2">
            Заметка <span className="text-tg-text-secondary/60">(необязательно)</span>
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={2}
            className="input resize-none"
          />
        </div>

        {error && (
          <div className="bg-tg-danger/10 border border-tg-danger/20 rounded-xl px-4 py-3 text-sm text-tg-danger">
            {error}
          </div>
        )}

        <button type="submit" disabled={updateMutation.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
          {updateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Сохранить изменения
            </>
          )}
        </button>
      </form>
    </div>
  );
}