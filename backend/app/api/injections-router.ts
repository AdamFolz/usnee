import { z } from "zod";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { injections, users } from "../db/schema";

export const injectionsRouter = createRouter({
  // Create a new injection record
  create: authedQuery
    .input(
      z.object({
        method: z.enum(["intravenous", "intramuscular", "subcutaneous"]),
        site: z.string().min(1).max(50),
        volumeMl: z.number().positive().max(100),
        trigger: z.enum([
          "stress",
          "boredom",
          "company",
          "pain",
          "habit",
          "celebration",
          "withdrawal",
          "experiment",
          "no_reason",
        ]).optional(),
        triggerNote: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Insert injection record
      const [result] = await db.insert(injections).values({
        userId,
        method: input.method,
        site: input.site,
        volumeMl: String(input.volumeMl),
        trigger: input.trigger || null,
        triggerNote: input.triggerNote || null,
      });

      // Update user XP (10 XP per injection)
      await db
        .update(users)
        .set({
          xp: sql`${users.xp} + 10`,
          level: sql`1 + FLOOR((${users.xp} + 10) / 100)`,
        })
        .where(eq(users.id, userId));

      return {
        success: true,
        injectionId: Number(result.insertId),
        message: "Записано ✓",
      };
    }),

  // Get user's statistics
  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCountResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(injections)
      .where(
        and(
          eq(injections.userId, userId),
          eq(injections.isCancelled, false),
          gte(injections.injectedAt, today)
        )
      );

    const todayCount = Number(todayCountResult[0]?.count || 0);

    // Get last injection
    const lastInjectionResult = await db
      .select()
      .from(injections)
      .where(
        and(eq(injections.userId, userId), eq(injections.isCancelled, false))
      )
      .orderBy(desc(injections.injectedAt))
      .limit(1);

    const lastInjection = lastInjectionResult[0];

    // Calculate time since last injection
    let lastInjectionAgo = "";
    if (lastInjection) {
      const now = new Date();
      const diff = now.getTime() - new Date(lastInjection.injectedAt).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        lastInjectionAgo = `${hours}ч ${minutes}м`;
      } else {
        lastInjectionAgo = `${minutes}м`;
      }
    }

    // Calculate average interval between injections (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInjections = await db
      .select()
      .from(injections)
      .where(
        and(
          eq(injections.userId, userId),
          eq(injections.isCancelled, false),
          gte(injections.injectedAt, thirtyDaysAgo)
        )
      )
      .orderBy(desc(injections.injectedAt));

    let avgInterval = 0;
    if (recentInjections.length >= 2) {
      let totalInterval = 0;
      for (let i = 0; i < recentInjections.length - 1; i++) {
        const diff =
          new Date(recentInjections[i].injectedAt).getTime() -
          new Date(recentInjections[i + 1].injectedAt).getTime();
        totalInterval += diff;
      }
      avgInterval = totalInterval / (recentInjections.length - 1) / (1000 * 60 * 60); // in hours
    }

    // Get top trigger
    const triggerCounts = await db
      .select({
        trigger: injections.trigger,
        count: sql<number>`COUNT(*)`,
      })
      .from(injections)
      .where(
        and(
          eq(injections.userId, userId),
          eq(injections.isCancelled, false)
        )
      )
      .groupBy(injections.trigger)
      .orderBy(sql`COUNT(*) DESC`);

    const topTrigger = triggerCounts[0]?.trigger || "";

    // Get user XP and level
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return {
      dailyCount: todayCount,
      lastInjectionAgo,
      avgInterval: Math.round(avgInterval * 10) / 10,
      topTrigger,
      totalXp: user?.xp || 0,
      level: user?.level || 1,
    };
  }),

  // Get injection history (cursor-based pagination)
  history: authedQuery
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const conditions = [
        eq(injections.userId, userId),
        eq(injections.isCancelled, false),
      ];

      if (input.cursor) {
        conditions.push(sql`${injections.injectedAt} < ${new Date(input.cursor)}`);
      }

      const items = await db
        .select()
        .from(injections)
        .where(and(...conditions))
        .orderBy(desc(injections.injectedAt))
        .limit(input.limit + 1);

      const hasMore = items.length > input.limit;
      const result = hasMore ? items.slice(0, -1) : items;

      const nextCursor =
        hasMore && result.length > 0
          ? new Date(result[result.length - 1].injectedAt).toISOString()
          : null;

      return {
        items: result,
        nextCursor,
        hasMore,
      };
    }),

  // Cancel an injection (soft delete)
  cancel: authedQuery
    .input(
      z.object({
        id: z.number(),
        reason: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Verify the injection belongs to the user
      const [injection] = await db
        .select()
        .from(injections)
        .where(and(eq(injections.id, input.id), eq(injections.userId, userId)));

      if (!injection) {
        throw new Error("Injection not found");
      }

      if (injection.isCancelled) {
        throw new Error("Injection already cancelled");
      }

      await db
        .update(injections)
        .set({
          isCancelled: true,
          cancelledAt: new Date(),
          cancelReason: input.reason || null,
        })
        .where(eq(injections.id, input.id));

      return { success: true, message: "Запись отменена" };
    }),
});
