import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { api } from '@/api/client';
import { METHOD_LABELS, TRIGGER_LABELS } from '@/lib/constants';

export default function ExportData() {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    setSuccess(false);
    try {
      let allItems = [];
      let cursor = null;
      do {
        const page = await api.getHistory(cursor, 100);
        allItems = [...allItems, ...(page.items || [])];
        cursor = page.next_cursor;
      } while (cursor);

      setCount(allItems.length);

      const headers = ['Дата', 'Метод', 'Место', 'Объём (мл)', 'Триггер', 'Заметка', 'Статус'];
      const rows = allItems.map((item) => [
        new Date(item.injected_at).toLocaleString('ru-RU'),
        METHOD_LABELS[item.method] || item.method || '',
        item.site || '',
        item.volume_ml ?? '',
        TRIGGER_LABELS[item.trigger] || item.trigger || '',
        (item.note || '').replace(/"/g, '""'),
        item.cancelled ? 'Отменена' : 'Активна',
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell)}"`).join(','))
        .join('\n');

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usnee_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Не удалось экспортировать данные');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Экспорт данных" icon={Download} />

      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-tg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileDown className="w-8 h-8 text-tg-primary" />
            </div>
            <h2 className="font-bold text-tg-text mb-2">Экспорт истории</h2>
            <p className="text-sm text-tg-text-secondary max-w-xs mx-auto mb-6">
              Скачайте все записи в формате CSV. Файл можно открыть в Excel или Google Sheets.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary flex items-center justify-center gap-2 mx-auto"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Экспорт...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Скачать CSV
                </>
              )}
            </button>
          </div>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-tg-success/5 border-tg-success/20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-tg-success shrink-0" />
              <div>
                <p className="font-medium text-tg-success">Экспорт завершён</p>
                <p className="text-xs text-tg-text-secondary">
                  {count} {count === 1 ? 'запись' : count < 5 ? 'записи' : 'записей'} выгружено
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-tg-danger/5 border-tg-danger/20"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-tg-danger shrink-0" />
              <p className="text-sm text-tg-danger">{error}</p>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card">
            <p className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-2">
              Что включено в экспорт
            </p>
            <ul className="space-y-1.5">
              {['Дата и время', 'Метод инъекции', 'Место', 'Объём (мл)', 'Триггер', 'Заметка', 'Статус записи'].map(
                (field) => (
                  <li key={field} className="text-sm text-tg-text-secondary flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-tg-success shrink-0" />
                    {field}
                  </li>
                )
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}