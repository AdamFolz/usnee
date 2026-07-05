import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import * as relations from "./relations";

const fullSchema = { ...schema, ...relations };

const DEFAULT_ACHIEVEMENTS = [
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

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!, {
    mode: "planetscale",
    schema: fullSchema,
  });

  console.log("Checking achievements...");

  const existing = await db.select().from(schema.achievements);

  if (existing.length === 0) {
    console.log("Seeding achievements...");
    for (const ach of DEFAULT_ACHIEVEMENTS) {
      await db.insert(schema.achievements).values(ach);
      console.log(`  Created: ${ach.title}`);
    }
    console.log(`Seeded ${DEFAULT_ACHIEVEMENTS.length} achievements.`);
  } else {
    console.log(`Found ${existing.length} existing achievements. Skipping seed.`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
