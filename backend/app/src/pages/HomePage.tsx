import { useState, useCallback } from "react";
import { useStats, useCreateInjection, useCheckAchievements } from "@/hooks/useInjections";
import { triggerConfig, methodConfig, siteConfigDefault } from "@/config";
import type { Method, Trigger, NewAchievement } from "@/types";
import AchievementPopup from "@/components/AchievementPopup";
import BreathingExercise from "@/components/BreathingExercise";
import EmergencyHelp from "@/components/EmergencyHelp";
import { Wind, AlertTriangle, Plus, Minus } from "lucide-react";

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const createInjection = useCreateInjection();
  const checkAchievements = useCheckAchievements();

  const [method, setMethod] = useState<Method>("intravenous");
  const [site, setSite] = useState("left_arm");
  const [volume, setVolume] = useState(1.0);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [newAchievements, setNewAchievements] = useState<NewAchievement[]>([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  const handleRecord = useCallback(async () => {
    try {
      const result = await createInjection.mutateAsync({
        method,
        site: siteConfigDefault.find((s) => s.id === site)?.label || site,
        volumeMl: volume,
        trigger: selectedTrigger || undefined,
      });

      if (result && typeof result === "object" && "injectionId" in result) {
        const injectionId = (result as { injectionId: number }).injectionId;
        const checkResult = await checkAchievements.mutateAsync({ injectionId });
        if (
          checkResult &&
          typeof checkResult === "object" &&
          "newAchievements" in checkResult &&
          Array.isArray((checkResult as { newAchievements: NewAchievement[] }).newAchievements) &&
          (checkResult as { newAchievements: NewAchievement[] }).newAchievements.length > 0
        ) {
          setNewAchievements((checkResult as { newAchievements: NewAchievement[] }).newAchievements);
          setShowAchievementPopup(true);
        }
      }

      // Reset form
      setSelectedTrigger(null);
    } catch {
      // Error handled by mutation
    }
  }, [createInjection, checkAchievements, method, site, volume, selectedTrigger]);

  const adjustVolume = (delta: number) => {
    setVolume((prev) => Math.max(0.1, Math.min(10, Math.round((prev + delta) * 10) / 10)));
  };

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">
          USNEE
        </h1>
        <p className="text-[#666] text-xs mt-1">
          Без осуждения, только факты
        </p>
      </div>

      {/* Stats Grid */}
      <div className="glass-card rounded-2xl p-4">
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/[0.04] rounded-xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/[0.04]">
              <div className="text-2xl font-bold text-white">
                {stats.dailyCount}
              </div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">
                Сегодня
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.04]">
              <div className="text-2xl font-bold text-white">
                {stats.lastInjectionAgo || "—"}
              </div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">
                Последняя
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.04]">
              <div className="text-2xl font-bold text-white">
                {stats.avgInterval > 0 ? `${stats.avgInterval}ч` : "—"}
              </div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">
                Интервал
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.04]">
              <div className="text-2xl font-bold text-[#a855f7]">
                {stats.level}
              </div>
              <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">
                Уровень
              </div>
              <div className="text-[10px] text-[#eab308]">
                {stats.totalXp} XP
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Trigger Selector */}
      <div>
        <h3 className="text-sm text-[#888] mb-3 text-center">
          Что спровоцировало?
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {triggerConfig.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() =>
                setSelectedTrigger(
                  selectedTrigger === trigger.id ? null : (trigger.id as Trigger)
                )
              }
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs transition-all ${
                selectedTrigger === trigger.id
                  ? "bg-[#7c3aed]/30 ring-1 ring-[#a855f7] text-white"
                  : "bg-white/[0.04] text-[#888] hover:bg-white/[0.08]"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: trigger.color }}
              />
              <span>{trigger.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entry Details */}
      <div className="glass-card rounded-2xl p-4 space-y-4">
        {/* Method */}
        <div>
          <label className="text-xs text-[#666] mb-2 block">Способ</label>
          <div className="flex gap-2">
            {methodConfig.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as Method)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  method === m.id
                    ? "bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white"
                    : "bg-white/[0.04] text-[#888] hover:bg-white/[0.08]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Site */}
        <div>
          <label className="text-xs text-[#666] mb-2 block">Место</label>
          <select
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-white/[0.04] text-white text-sm border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#a855f7] appearance-none"
          >
            {siteConfigDefault.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#1a1635]">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Volume */}
        <div>
          <label className="text-xs text-[#666] mb-2 block">Объём (мл)</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustVolume(-0.1)}
              className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#888] hover:bg-white/[0.08] transition-colors"
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-white">{volume.toFixed(1)}</span>
              <span className="text-[#666] text-sm ml-1">мл</span>
            </div>
            <button
              onClick={() => adjustVolume(0.1)}
              className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#888] hover:bg-white/[0.08] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Record Button */}
      <button
        onClick={handleRecord}
        disabled={createInjection.isPending}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#7c3aed]/25"
      >
        {createInjection.isPending ? "Записываем..." : "ЗАПИСАТЬ"}
      </button>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowBreathing(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] text-[#888] hover:bg-white/[0.08] transition-colors text-sm"
        >
          <Wind size={16} />
          <span>Дыхание</span>
        </button>
        <button
          onClick={() => setShowEmergency(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors text-sm"
        >
          <AlertTriangle size={16} />
          <span>SOS</span>
        </button>
      </div>

      {/* Modals */}
      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      {showEmergency && <EmergencyHelp onClose={() => setShowEmergency(false)} />}
      {showAchievementPopup && (
        <AchievementPopup
          achievements={newAchievements}
          onClose={() => {
            setShowAchievementPopup(false);
            setNewAchievements([]);
          }}
        />
      )}
    </div>
  );
}
