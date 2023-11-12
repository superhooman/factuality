import { createTRPCRouter } from "@src/server/api/trpc";
import { checkRouter } from "./routers/check";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  check: checkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
