import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface BreathingExerciseProps {
  onClose: () => void;
}

export default function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const PHASE_DURATION = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
  };

  const startExercise = useCallback(() => {
    setIsActive(true);
    setPhase("inhale");
    setCountdown(PHASE_DURATION.inhale);
    setCycle(1);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          setPhase((currentPhase) => {
            const phases: Array<"inhale" | "hold" | "exhale" | "rest"> = [
              "inhale",
              "hold",
              "exhale",
              "rest",
            ];
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            const nextPhase = phases[nextIndex];

            if (nextPhase === "inhale") {
              setCycle((c) => c + 1);
            }

            // Set the next countdown after state update
            setTimeout(() => {
              setCountdown(PHASE_DURATION[nextPhase]);
            }, 0);

            return nextPhase;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale":
        return "Вдох...";
      case "hold":
        return "Задержите...";
      case "exhale":
        return "Выдох...";
      case "rest":
        return "Пауза...";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return "scale-150";
      case "hold":
        return "scale-150";
      case "exhale":
        return "scale-100";
      case "rest":
        return "scale-100";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative mx-4 w-full max-w-sm">
        <div className="glass-card rounded-2xl p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-[#666] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-semibold text-white mb-1">
            Дыхательное упражнение
          </h3>
          <p className="text-[#888] text-xs mb-6">
            4-4-4 техника. Помогает снизить тревожность.
          </p>

          {!isActive ? (
            <div className="py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7c3aed]/30 to-[#a855f7]/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7c3aed]/50 to-[#a855f7]/50" />
              </div>
              <button
                onClick={startExercise}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Начать
              </button>
            </div>
          ) : (
            <div className="py-4">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#7c3aed]/40 to-[#a855f7]/40 transition-transform duration-[4000ms] ease-in-out ${getCircleScale()}`}
                />
                <div
                  className={`absolute inset-2 rounded-full bg-gradient-to-br from-[#7c3aed]/60 to-[#a855f7]/60 transition-transform duration-[4000ms] ease-in-out ${getCircleScale()}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {countdown > 0 ? countdown : ""}
                  </span>
                </div>
              </div>

              <p className="text-lg font-medium text-[#a855f7] mb-2">
                {getPhaseLabel()}
              </p>

              <p className="text-[#666] text-xs mb-4">
                Цикл {cycle} / 10
              </p>

              {cycle >= 10 && (
                <div className="mt-4">
                  <p className="text-[#22c55e] text-sm mb-3">
                    Отлично! Вы завершили упражнение.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Закрыть
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setIsActive(false);
                  setPhase("rest");
                  setCycle(0);
                }}
                className="mt-2 text-[#666] text-xs hover:text-[#999] transition-colors"
              >
                Остановить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
