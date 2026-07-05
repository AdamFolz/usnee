import { useEffect, useState } from "react";
import type { NewAchievement } from "@/types";
import { X, Trophy } from "lucide-react";

interface AchievementPopupProps {
  achievements: NewAchievement[];
  onClose: () => void;
}

export default function AchievementPopup({ achievements, onClose }: AchievementPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setIsVisible(true);
    }
  }, [achievements]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsVisible(false);
          onClose();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentIndex, achievements.length, onClose]);

  if (!isVisible || achievements.length === 0) return null;

  const achievement = achievements[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-sm">
        <div className="glass-card rounded-2xl p-6 text-center animate-scale-in">
          <button
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="absolute top-3 right-3 text-[#666] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="mb-4">
            <Trophy size={40} className="mx-auto text-[#a855f7]" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-1">
            Новая ачивка!
          </h3>

          <div className="text-4xl mb-3">{achievement.icon}</div>

          <h4 className="text-[#a855f7] font-medium text-lg mb-2">
            {achievement.title}
          </h4>

          <p className="text-[#888] text-sm mb-3">
            {achievement.description}
          </p>

          <div className="text-[#eab308] text-sm font-medium">
            +{achievement.xpReward} XP
          </div>

          <button
            onClick={() => {
              if (currentIndex < achievements.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                setIsVisible(false);
                onClose();
              }
            }}
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Круто!
          </button>
        </div>
      </div>
    </div>
  );
}
