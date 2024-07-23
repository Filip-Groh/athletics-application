import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { raceRouter } from "~/server/api/routers/race";
import { eventRouter } from "~/server/api/routers/event";
import { measurementRouter } from "~/server/api/routers/measurement";
import { performanceRouter } from "~/server/api/routers/performance";
import { racerRouter } from "~/server/api/routers/racer";
import { ageCoeficientRouter } from "~/server/api/routers/ageCoeficient";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  race: raceRouter,
  event: eventRouter,
  measurement: measurementRouter,
  performance: performanceRouter,
  racer: racerRouter,
  ageCoeficient: ageCoeficientRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
