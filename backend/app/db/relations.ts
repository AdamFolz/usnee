import { relations } from "drizzle-orm";
import { users, injections, achievements, userAchievements } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  injections: many(injections),
  userAchievements: many(userAchievements),
}));

export const injectionsRelations = relations(injections, ({ one }) => ({
  user: one(users, {
    fields: [injections.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));
