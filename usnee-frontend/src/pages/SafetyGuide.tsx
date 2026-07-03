import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, Heart, Syringe, Droplets, Thermometer, Phone } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const SECTIONS = [
  {
    icon: Shield,
    color: 'text-tg-success',
    bg: 'bg-tg-success/10',
    title: 'Гигиена',
    items: [
      'Мой руки до и после инъекции',
      'Используй новый шприц каждый раз',
      'Дезинфицируй место инъекции спиртом',
      'Не делись шприцами — ни с кем',
    ],
  },
  {
    icon: Syringe,
    color: 'text-tg-primary',
    bg: 'bg-tg-primary/10',
    title: 'Ротация мест',
    items: [
      'Не коли в одно и то же место дважды подряд',
      'Минимум 2 см между точками',
      'Дай месту зажить — минимум 3 дня',
      'Если уплотнение — смени место немедленно',
    ],
  },
  {
    icon: AlertTriangle,
    color: 'text-tg-warning',
    bg: 'bg-tg-warning/10',
    title: 'Признаки передозировки',
    items: [
      'Затруднённое дыхание или остановка',
      'Синие губы и ногти',
      'Невозможность разбудить человека',
      'Холодная и влажная кожа',
    ],
  },
  {
    icon: Heart,
    color: 'text-tg-danger',
    bg: 'bg-tg-danger/10',
    title: 'Первая помощь',
    items: [
      'Вызови скорую: 103 или 112',
      'Положи человека на бок (recovery position)',
      'Если есть налоксон — используй',
      'Не оставляй одного ни на минуту',
    ],
  },
  {
    icon: Droplets,
    color: 'text-usnee-400',
    bg: 'bg-usnee-500/10',
    title: 'Фильтрация',
    items: [
      'Используй микрофильтр 0.45 мкм или меньше',
      'Не используй вату — она разлагается',
      'Меняй фильтр каждый раз',
    ],
  },
  {
    icon: Thermometer,
    color: 'text-tg-text-secondary',
    bg: 'bg-tg-bg-secondary',
    title: 'Температура раствора',
    items: [
      'Не грей раствор в микроволновке',
      'Комнатная температура — норма',
      'Горячий раствор — ожоги вен',
    ],
  },
];

export const SafetyGuide: React.FC<Props> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-tg-bg pb-20"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-tg-separator">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-tg-bg-elevated transition-colors">
          <ArrowLeft size={24} className="text-tg-text" />
        </button>
        <h1 className="text-xl font-bold text-tg-text">Гид по безопасности</h1>
      </div>

      {/* Emergency Banner */}
      <div className="mx-4 mt-4 p-4 bg-tg-danger/10 border border-tg-danger/20 rounded-2xl">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-tg-danger" />
          <div>
            <p className="text-tg-danger font-semibold">Экстренная помощь</p>
            <p className="text-tg-text-secondary text-sm">103 — скорая помощь</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-4">
        {SECTIONS.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${section.bg}`}>
                  <Icon size={20} className={section.color} />
                </div>
                <h2 className="text-lg font-semibold text-tg-text">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-tg-text-secondary">
                    <span className="text-tg-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
