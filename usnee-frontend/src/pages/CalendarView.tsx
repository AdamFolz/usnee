import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const CalendarView: React.FC<Props> = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Mock injection data
  const injectionDays = [3, 5, 8, 12, 15, 18, 22, 25, 28];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-tg-bg pb-20"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-tg-separator">
        <button onClick={onBack} className="p-2 glass rounded-full">
          <ArrowLeft size={20} className="text-tg-text" />
        </button>
        <h1 className="text-xl font-bold text-tg-text">Календарь</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Month Selector */}
        <div className="glass p-4 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ChevronLeft size={20} className="text-tg-text" />
          </button>
          <h2 className="text-lg font-semibold text-tg-text">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ChevronRight size={20} className="text-tg-text" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="glass p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-tg-text-tertiary font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasInjection = injectionDays.includes(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth();

              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.9 }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isToday
                      ? 'bg-tg-primary text-white'
                      : hasInjection
                      ? 'bg-tg-success/15 text-tg-success'
                      : 'hover:bg-white/5 text-tg-text'
                  }`}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {hasInjection && !isToday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-tg-success" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="glass p-4 space-y-3">
          <p className="text-sm font-medium text-tg-text">Легенда</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tg-primary" />
              <span className="text-xs text-tg-text-secondary">Сегодня</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tg-success" />
              <span className="text-xs text-tg-text-secondary">Запись</span>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="glass p-4">
          <p className="text-sm font-medium text-tg-text mb-3">Итоги месяца</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-tg-text">9</p>
              <p className="text-xs text-tg-text-secondary">Записей</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-tg-text">2.3ч</p>
              <p className="text-xs text-tg-text-secondary">Ср. интервал</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-tg-text">Стресс</p>
              <p className="text-xs text-tg-text-secondary">Топ триггер</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
