import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

// Users table - managed by auth system
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Injections table - records of substance use
export const injections = mysqlTable("injections", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  method: varchar("method", { length: 50 }).notNull(), // intravenous, intramuscular, subcutaneous
  site: varchar("site", { length: 50 }).notNull(), // injection site
  volumeMl: decimal("volume_ml", { precision: 5, scale: 2 }).notNull(),
  trigger: varchar("trigger", { length: 50 }), // stress, boredom, company, pain, habit, celebration, withdrawal, experiment, no_reason
  triggerNote: text("trigger_note"),
  isCancelled: boolean("is_cancelled").default(false).notNull(),
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  injectedAt: timestamp("injected_at").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Injection = typeof injections.$inferSelect;
export type InsertInjection = typeof injections.$inferInsert;

// Achievements table - available achievements
export const achievements = mysqlTable("achievements", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 10 }).default("🏆").notNull(),
  xpReward: int("xp_reward").default(0).notNull(),
  category: mysqlEnum("category", ["ironic", "positive"]).default("ironic").notNull(),
  conditionType: varchar("condition_type", { length: 50 }).notNull(), // daily_count, night_count, interval, speedrun, marathon, collector, etc.
  conditionValue: int("condition_value").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

// User achievements junction table
export const userAchievements = mysqlTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  achievementId: bigint("achievementId", { mode: "number", unsigned: true }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
