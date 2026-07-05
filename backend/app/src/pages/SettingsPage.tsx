import { useAchievements } from "@/hooks/useAchievements";
import { useAuth } from "@/hooks/useAuth";
import { useStats } from "@/hooks/useInjections";
import { Trophy, Lock, Star, LogOut, Shield, Info, Heart } from "lucide-react";

export default function SettingsPage() {
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: stats } = useStats();
  const { logout } = useAuth();

  const unlockedCount = achievements?.filter((a) => a.unlocked).length || 0;
  const totalCount = achievements?.length || 0;

  return (
    <div className="min-h-full p-4 space-y-4">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-xl font-semibold text-white">Настройки</h1>
      </div>

      {/* User Stats */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center">
            <Star size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold">
              Уровень {stats?.level || 1}
            </div>
            <div className="text-[#888] text-xs mt-0.5">
              {stats?.totalXp || 0} XP всего
            </div>
            <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] rounded-full transition-all"
                style={{
                  width: `${(((stats?.totalXp || 0) % 100) / 100) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-[#666] mt-1">
              До следующего уровня: {100 - ((stats?.totalXp || 0) % 100)} XP
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-[#888] font-medium">Ачивки</h3>
          <span className="text-xs text-[#666]">
            {unlockedCount}/{totalCount}
          </span>
        </div>

        {achievementsLoading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 glass-card rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {achievements?.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  achievement.unlocked
                    ? "glass-card"
                    : "bg-white/[0.02] opacity-50"
                }`}
              >
                <div className="text-xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {achievement.unlocked ? (
                      achievement.title
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Lock size={10} />
                        <span className="text-[#666]">Заблокировано</span>
                      </span>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-[#666] text-xs mt-0.5">
                      {achievement.description}
                    </div>
                  )}
                </div>
                {achievement.unlocked && (
                  <div className="flex items-center gap-1 text-[#eab308] text-xs shrink-0">
                    <Trophy size={12} />
                    <span>+{achievement.xpReward}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-[#a855f7]" />
          <div>
            <div className="text-white text-sm">Анонимность</div>
            <div className="text-[#666] text-xs">
              Ваши данные не передаются третьим лицам
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Info size={16} className="text-[#3b82f6]" />
          <div>
            <div className="text-white text-sm">Информация</div>
            <div className="text-[#666] text-xs">
              USNEE — инструмент снижения вреда, не медицинская помощь
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Heart size={16} className="text-[#ef4444]" />
          <div>
            <div className="text-white text-sm">Harm Reduction</div>
            <div className="text-[#666] text-xs">
              Без осуждения, только факты
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors text-sm"
      >
        <LogOut size={16} />
        Выйти
      </button>

      {/* Version */}
      <div className="text-center text-[10px] text-[#444] pb-4">
        USNEE v2.0 — Harm Reduction Companion
      </div>
    </div>
  );
}
