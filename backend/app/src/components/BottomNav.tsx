import type { Tab } from "@/types";
import { Home, History, Settings } from "lucide-react";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "history", label: "История", icon: History },
  { id: "settings", label: "Настройки", icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="shrink-0 h-16 bg-[#16123a]/80 backdrop-blur-xl border-t border-white/[0.06] z-50">
      <div className="flex items-center justify-around h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                isActive ? "text-[#a855f7]" : "text-[#666] hover:text-[#999]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px]">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#a855f7] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
