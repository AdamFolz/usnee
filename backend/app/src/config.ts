export const siteConfig = {
  title: "USNEE",
  description: "Без осуждения, только факты — harm reduction companion",
  language: "ru",
};

export const triggerConfig = [
  { id: "stress", label: "Стресс", icon: "🔴", color: "#ef4444" },
  { id: "boredom", label: "Скука", icon: "⚫", color: "#6b7280" },
  { id: "company", label: "Компания", icon: "🔵", color: "#3b82f6" },
  { id: "pain", label: "Боль", icon: "🟠", color: "#f97316" },
  { id: "habit", label: "Привычка", icon: "🟣", color: "#a855f7" },
  { id: "celebration", label: "Праздник", icon: "🟡", color: "#eab308" },
  { id: "withdrawal", label: "Ломка", icon: "🟤", color: "#92400e" },
  { id: "experiment", label: "Эксперимент", icon: "🟢", color: "#22c55e" },
  { id: "no_reason", label: "Просто так", icon: "⚪", color: "#9ca3af" },
] as const;

export const methodConfig = [
  { id: "intravenous", label: "В/в", fullLabel: "Внутривенно" },
  { id: "intramuscular", label: "В/м", fullLabel: "Внутримышечно" },
  { id: "subcutaneous", label: "П/к", fullLabel: "Подкожно" },
] as const;

export const siteConfigDefault = [
  { id: "left_arm", label: "Левая рука" },
  { id: "right_arm", label: "Правая рука" },
  { id: "left_leg", label: "Левая нога" },
  { id: "right_leg", label: "Правая нога" },
  { id: "stomach", label: "Живот" },
  { id: "neck", label: "Шея" },
  { id: "other", label: "Другое" },
] as const;
