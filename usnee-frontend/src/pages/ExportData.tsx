import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileJson, FileSpreadsheet, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const ExportData: React.FC<Props> = ({ onBack }) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [range, setRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    // TODO: call API
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

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
        <h1 className="text-xl font-bold text-tg-text">Экспорт данных</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Format */}
        <div className="card">
          <p className="text-tg-text-secondary text-sm mb-3">Формат</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('csv')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                format === 'csv' ? 'bg-tg-primary text-white' : 'bg-tg-bg-secondary text-tg-text-secondary'
              }`}
            >
              <FileSpreadsheet size={18} />
              CSV
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                format === 'json' ? 'bg-tg-primary text-white' : 'bg-tg-bg-secondary text-tg-text-secondary'
              }`}
            >
              <FileJson size={18} />
              JSON
            </button>
          </div>
        </div>

        {/* Range */}
        <div className="card">
          <p className="text-tg-text-secondary text-sm mb-3">Период</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: '7d', label: '7 дней' },
              { key: '30d', label: '30 дней' },
              { key: '90d', label: '90 дней' },
              { key: 'all', label: 'Всё время' },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key as typeof range)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  range === r.key ? 'bg-tg-primary text-white' : 'bg-tg-bg-secondary text-tg-text-secondary'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button onClick={handleExport} className="btn-primary w-full flex items-center justify-center gap-2">
          {exported ? <Check size={20} /> : <Download size={20} />}
          {exported ? 'Готово!' : 'Экспортировать'}
        </button>

        <p className="text-tg-text-tertiary text-xs text-center">
          Данные сохраняются локально на вашем устройстве.
        </p>
      </div>
    </motion.div>
  );
};
