import { authRouter } from "./auth-router";
import { injectionsRouter } from "./injections-router";
import { achievementsRouter } from "./achievements-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  injections: injectionsRouter,
  achievements: achievementsRouter,
});

export type AppRouter = typeof appRouter;
