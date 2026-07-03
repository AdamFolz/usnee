import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

function loadReminders() {
  try {
    return JSON.parse(localStorage.getItem('usnee_reminders') || '[]');
  } catch {
    return [];
  }
}

function saveReminders(reminders) {
  localStorage.setItem('usnee_reminders', JSON.stringify(reminders));
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [time, setTime] = useState('20:00');
  const [label, setLabel] = useState('');

  useEffect(() => {
    setReminders(loadReminders());
  }, []);

  const addReminder = () => {
    if (!time) return;
    const newReminder = {
      id: Date.now().toString(),
      time,
      label: label || 'Напоминание',
      enabled: true,
    };
    const updated = [...reminders, newReminder].sort((a, b) => a.time.localeCompare(b.time));
    setReminders(updated);
    saveReminders(updated);
    setLabel('');
    setTime('20:00');
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  const toggleReminder = (id) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setReminders(updated);
    saveReminders(updated);
  };

  return (
    <div className="px-4 pt-4">
      <PageHeader title="Напоминания" icon={Bell} />

      <div className="space-y-4">
        {/* Add form */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card">
            <p className="text-xs font-semibold text-tg-text-secondary uppercase tracking-wide mb-3">
              Добавить напоминание
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-tg-text-secondary shrink-0" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input flex-1"
              />
            </div>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Название (необязательно)"
              className="input mb-3"
              autoComplete="off"
            />
            <button onClick={addReminder} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Добавить
            </button>
          </div>
        </motion.div>

        {/* List */}
        {reminders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="card text-center py-12">
              <div className="text-4xl mb-3">🔔</div>
              <p className="font-semibold text-tg-text mb-1">Нет напоминаний</p>
              <p className="text-sm text-tg-text-secondary">
                Добавьте напоминание, чтобы не забывать делать записи
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {reminders.map((rem, i) => (
                <motion.div
                  key={rem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.03 }}
                  className={`card flex items-center gap-3 ${rem.enabled ? '' : 'opacity-50'}`}
                >
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      rem.enabled ? 'bg-tg-primary' : 'bg-tg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        rem.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-tg-text">{rem.time}</p>
                    <p className="text-xs text-tg-text-secondary truncate">{rem.label}</p>
                  </div>
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-tg-text-secondary hover:text-tg-danger hover:bg-tg-danger/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}