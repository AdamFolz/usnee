import { z } from "zod";
import { eq, and, sql, gte, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { achievements, userAchievements, injections, users } from "../db/schema";

// Achievement definitions with their condition checks
const ACHIEVEMENT_DEFINITIONS = [
  {
    code: "still_alive",
    title: "Ого, ты всё ещё живой",
    description: "5 инъекций за день",
    icon: "😮",
    xpReward: 10,
    category: "ironic" as const,
    conditionType: "daily_count",
    conditionValue: 5,
  },
  {
    code: "work_tomorrow",
    title: "Надеюсь, завтра не на работу",
    description: "3 ночные (00-06)",
    icon: "🌙",
    xpReward: 15,
    category: "ironic" as const,
    conditionType: "night_count",
    conditionValue: 3,
  },
  {
    code: "barely_breathing",
    title: "Еле-еле",
    description: "Интервал < 1 часа",
    icon: "😰",
    xpReward: 5,
    category: "ironic" as const,
    conditionType: "short_interval",
    conditionValue: 1,
  },
  {
    code: "to_infinity",
    title: "Бесконечность не предел",
    description: "10 инъекций за сутки",
    icon: "♾️",
    xpReward: 20,
    category: "ironic" as const,
    conditionType: "daily_count",
    conditionValue: 10,
  },
  {
    code: "vampire",
    title: "Ночная смена",
    description: "Все инъекции ночью",
    icon: "🧛",
    xpReward: 15,
    category: "ironic" as const,
    conditionType: "all_night",
    conditionValue: 3,
  },
  {
    code: "speedrun",
    title: "Спидраннер",
    description: "3 инъекции в течение 1 часа",
    icon: "⚡",
    xpReward: 25,
    category: "ironic" as const,
    conditionType: "speedrun",
    conditionValue: 3,
  },
  {
    code: "marathon",
    title: "Марафонец",
    description: "24 часа с инъекциями каждый час",
    icon: "🏃",
    xpReward: 50,
    category: "ironic" as const,
    conditionType: "marathon",
    conditionValue: 24,
  },
  {
    code: "collector",
    title: "Коллекционер",
    description: "5 разных мест",
    icon: "📍",
    xpReward: 10,
    category: "ironic" as const,
    conditionType: "collector",
    conditionValue: 5,
  },
  {
    code: "diary",
    title: "Писатель",
    description: "3 заметки о триггерах",
    icon: "📝",
    xpReward: 15,
    category: "positive" as const,
    conditionType: "diary",
    conditionValue: 3,
  },
];

// Ensure achievements exist in DB
async function seedAchievements() {
  const db = getDb();
  const existing = await db.select().from(achievements);

  if (existing.length === 0) {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      await db.insert(achievements).values({
        code: def.code,
        title: def.title,
        description: def.description,
        icon: def.icon,
        xpReward: def.xpReward,
        category: def.category,
        conditionType: def.conditionType,
        conditionValue: def.conditionValue,
      });
    }
  }
}

export const achievementsRouter = createRouter({
  // Get all achievements for current user
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    await seedAchievements();

    const userId = ctx.user.id;

    // Get all achievements
    const allAchievements = await db.select().from(achievements);

    // Get user's unlocked achievements
    const unlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

    return allAchievements.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
      unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt || null,
    }));
  }),

  // Check and unlock achievements after injection
  check: authedQuery
    .input(z.object({ injectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      await seedAchievements();

      const newAchievements: Array<{
        code: string;
        title: string;
        description: string;
        icon: string;
        xpReward: number;
        category: string;
      }> = [];

      // Get the injection
      const [injection] = await db
        .select()
        .from(injections)
        .where(
          and(eq(injections.id, input.injectionId), eq(injections.userId, userId))
        );

      if (!injection) return { newAchievements };

      // Get user's already unlocked achievements
      const unlocked = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId));

      const unlockedCodes = new Set(
        unlocked.map((u) => u.achievementId)
      );

      // Get all achievement definitions
      const allAchievements = await db.select().from(achievements);

      // Get today's injections
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayInjections = await db
        .select()
        .from(injections)
        .where(
          and(
            eq(injections.userId, userId),
            eq(injections.isCancelled, false),
            gte(injections.injectedAt, today)
          )
        )
        .orderBy(desc(injections.injectedAt));

      // Check each achievement
      for (const ach of allAchievements) {
        if (unlockedCodes.has(ach.id)) continue;

        let shouldUnlock = false;

        switch (ach.conditionType) {
          case "daily_count": {
            if (todayInjections.length >= ach.conditionValue) {
              shouldUnlock = true;
            }
            break;
          }

          case "night_count": {
            // Count night injections (00:00-06:00) today
            const nightCount = todayInjections.filter((inj) => {
              const hour = new Date(inj.injectedAt).getHours();
              return hour >= 0 && hour < 6;
            }).length;
            if (nightCount >= ach.conditionValue) {
              shouldUnlock = true;
            }
            break;
          }

          case "short_interval": {
            // Check if any two recent injections are within 1 hour
            if (todayInjections.length >= 2) {
              const latest = new Date(todayInjections[0].injectedAt).getTime();
              const previous = new Date(todayInjections[1].injectedAt).getTime();
              const diff = (latest - previous) / (1000 * 60 * 60); // hours
              if (diff < ach.conditionValue) {
                shouldUnlock = true;
              }
            }
            break;
          }

          case "speedrun": {
            // 3 injections within 1 hour
            if (todayInjections.length >= 3) {
              const latest = new Date(todayInjections[0].injectedAt).getTime();
              const third = new Date(todayInjections[2].injectedAt).getTime();
              const diff = (latest - third) / (1000 * 60 * 60); // hours
              if (diff <= 1) {
                shouldUnlock = true;
              }
            }
            break;
          }

          case "collector": {
            // Count unique sites
            const allInjections = await db
              .select()
              .from(injections)
              .where(
                and(eq(injections.userId, userId), eq(injections.isCancelled, false))
              );
            const uniqueSites = new Set(allInjections.map((i) => i.site));
            if (uniqueSites.size >= ach.conditionValue) {
              shouldUnlock = true;
            }
            break;
          }

          case "diary": {
            // Count injections with trigger notes
            const allInjections = await db
              .select()
              .from(injections)
              .where(
                and(eq(injections.userId, userId), eq(injections.isCancelled, false))
              );
            const withNotes = allInjections.filter(
              (i) => i.triggerNote && i.triggerNote.length > 0
            ).length;
            if (withNotes >= ach.conditionValue) {
              shouldUnlock = true;
            }
            break;
          }

          default:
            break;
        }

        if (shouldUnlock) {
          // Unlock achievement
          await db.insert(userAchievements).values({
            userId,
            achievementId: ach.id,
          });

          // Award XP
          await db
            .update(users)
            .set({
              xp: sql`${users.xp} + ${ach.xpReward}`,
              level: sql`1 + FLOOR((${users.xp} + ${ach.xpReward}) / 100)`,
            })
            .where(eq(users.id, userId));

          newAchievements.push({
            code: ach.code,
            title: ach.title,
            description: ach.description,
            icon: ach.icon,
            xpReward: ach.xpReward,
            category: ach.category,
          });
        }
      }

      return { newAchievements };
    }),
});
