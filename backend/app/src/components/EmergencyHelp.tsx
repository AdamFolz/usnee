import { X, Phone, Heart, AlertTriangle, Stethoscope } from "lucide-react";
import { useState } from "react";

interface EmergencyHelpProps {
  onClose: () => void;
}

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: typeof Phone;
  color: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "Единый номер",
    number: "112",
    description: "Экстренные службы",
    icon: Phone,
    color: "#ef4444",
  },
  {
    name: "Скорая помощь",
    number: "103",
    description: "Медицинская помощь",
    icon: Stethoscope,
    color: "#f97316",
  },
  {
    name: "Телефон доверия",
    number: "8-800-2000-122",
    description: "Психологическая помощь",
    icon: Heart,
    color: "#22c55e",
  },
];

const tips = [
  "Не оставляйте человека одного",
  "Положите на бок ( recovery position )",
  "Следите за дыханием",
  "Если есть налоксон — используйте",
  "Не давайте пить или есть",
  "Охлаждайте влажным полотенцем",
];

export default function EmergencyHelp({ onClose }: EmergencyHelpProps) {
  const [activeTab, setActiveTab] = useState<"contacts" | "guide">("contacts");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative mx-4 w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="glass-card rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#ef4444]" />
              <h3 className="text-lg font-semibold text-white">
                Экстренная помощь
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "contacts"
                  ? "text-[#a855f7] border-b-2 border-[#a855f7]"
                  : "text-[#666] hover:text-[#999]"
              }`}
            >
              Контакты
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "guide"
                  ? "text-[#a855f7] border-b-2 border-[#a855f7]"
                  : "text-[#666] hover:text-[#999]"
              }`}
            >
              Что делать
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto">
            {activeTab === "contacts" && (
              <div className="space-y-3">
                {emergencyContacts.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={contact.number}
                      href={`tel:${contact.number.replace(/[^0-9]/g, "")}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${contact.color}20` }}
                      >
                        <Icon size={18} style={{ color: contact.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {contact.name}
                        </div>
                        <div className="text-[#888] text-xs">
                          {contact.description}
                        </div>
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: contact.color }}
                      >
                        {contact.number}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {activeTab === "guide" && (
              <div className="space-y-3">
                <p className="text-[#ef4444] text-sm font-medium mb-3">
                  При передозировке:
                </p>
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#ef4444]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#ef4444] text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-[#e0e0e0] text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
