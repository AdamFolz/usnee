export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const INJECTION_METHODS = [
  { value: 'intravenous', label: 'В/в', fullLabel: 'Внутривенно', icon: '💧' },
  { value: 'intramuscular', label: 'В/м', fullLabel: 'Внутримышечно', icon: '💉' },
  { value: 'subcutaneous', label: 'П/к', fullLabel: 'Подкожно', icon: '📌' },
];

export const METHOD_LABELS = {
  intravenous: 'Внутривенно',
  intramuscular: 'Внутримышечно',
  subcutaneous: 'Подкожно',
};

export const METHOD_ICONS = {
  intravenous: '💧',
  intramuscular: '💉',
  subcutaneous: '📌',
};

export const COMMON_SITES = [
  'Левая рука',
  'Правая рука',
  'Левая нога',
  'Правая нога',
];

export const TRIGGERS = [
  { code: 'stress', label: 'Стресс', icon: '⚡' },
  { code: 'boredom', label: 'Скука', icon: '😴' },
  { code: 'company', label: 'Компания', icon: '👥' },
  { code: 'pain', label: 'Боль', icon: '🤕' },
  { code: 'habit', label: 'Привычка', icon: '🔄' },
  { code: 'celebration', label: 'Праздник', icon: '🎉' },
  { code: 'withdrawal', label: 'Ломка', icon: '💧' },
  { code: 'experiment', label: 'Эксперимент', icon: '🧪' },
  { code: 'no_reason', label: 'Просто так', icon: '🤷' },
];

export const TRIGGER_LABELS = TRIGGERS.reduce((acc, t) => {
  acc[t.code] = `${t.icon} ${t.label}`;
  return acc;
}, {});