import { useState } from "react";
import { useHistory, useCancelInjection } from "@/hooks/useInjections";
import { methodConfig } from "@/config";
import type { Injection } from "@/types";
import { Clock, MapPin, Droplets, X, Trash2 } from "lucide-react";

const triggerLabels: Record<string, string> = {
  stress: "Стресс",
  boredom: "Скука",
  company: "Компания",
  pain: "Боль",
  habit: "Привычка",
  celebration: "Праздник",
  withdrawal: "Ломка",
  experiment: "Эксперимент",
  no_reason: "Просто так",
};

const triggerColors: Record<string, string> = {
  stress: "#ef4444",
  boredom: "#6b7280",
  company: "#3b82f6",
  pain: "#f97316",
  habit: "#a855f7",
  celebration: "#eab308",
  withdrawal: "#92400e",
  experiment: "#22c55e",
  no_reason: "#9ca3af",
};

function getMethodLabel(method: string): string {
  return methodConfig.find((m) => m.id === method)?.label || method;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Только что";
  if (minutes < 60) return `${minutes}м назад`;
  if (hours < 24) return `${hours}ч назад`;
  return `${days}д назад`;
}

function HistoryItem({
  injection,
  onCancel,
}: {
  injection: Injection;
  onCancel: (id: number) => void;
}) {
  const [showCancel, setShowCancel] = useState(false);

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{
              backgroundColor:
                triggerColors[injection.trigger || "no_reason"] || "#9ca3af",
            }}
          />
          <div>
            <div className="text-white font-medium text-sm">
              {getMethodLabel(injection.method)} · {injection.volumeMl} мл
            </div>
            <div className="flex items-center gap-2 mt-1 text-[#666] text-xs">
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {injection.site}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatTimeAgo(injection.injectedAt)}
              </span>
            </div>
            {injection.trigger && (
              <div className="mt-1.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${triggerColors[injection.trigger]}20`,
                    color: triggerColors[injection.trigger],
                  }}
                >
                  {triggerLabels[injection.trigger]}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowCancel(!showCancel)}
          className="text-[#666] hover:text-[#ef4444] transition-colors p-1"
        >
          <X size={14} />
        </button>
      </div>

      {showCancel && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <p className="text-[#888] text-xs mb-2">
            Отменить эту запись? Она будет помечена как отменённая.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onCancel(injection.id);
                setShowCancel(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 text-[#ef4444] text-xs hover:bg-[#ef4444]/20 transition-colors"
            >
              <Trash2 size={12} />
              Отменить запись
            </button>
            <button
              onClick={() => setShowCancel(false)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-[#888] text-xs hover:bg-white/[0.08] transition-colors"
            >
              Нет
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const cancelMutation = useCancelInjection();

  const handleCancel = (id: number) => {
    cancelMutation.mutate({ id });
  };

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-xl font-semibold text-white">История</h1>
        <p className="text-[#666] text-xs mt-1">
          {history?.items ? `${history.items.length} записей` : ""}
        </p>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 glass-card rounded-xl" />
          ))}
        </div>
      ) : history?.items && history.items.length > 0 ? (
        <div className="space-y-3">
          {history.items.map((injection: Record<string, unknown>) => (
            <HistoryItem
              key={injection.id as number}
              injection={injection as unknown as Injection}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Droplets size={40} className="mx-auto text-[#333] mb-3" />
          <p className="text-[#666] text-sm">Пока нет записей</p>
          <p className="text-[#444] text-xs mt-1">
            Запишите первую инъекцию на главном экране
          </p>
        </div>
      )}
    </div>
  );
}
