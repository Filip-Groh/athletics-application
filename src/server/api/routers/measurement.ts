import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const saveMeasurementsSchema = z.object({
    performanceId: z.number(),
    measurements: z.array(z.object({
        id: z.optional(z.number()),
        value: z.number().or(z.nan())
    }))
})

export const measurementRouter = createTRPCRouter({
    saveMeasurementsOnPerformance: protectedProcedure
        .input(saveMeasurementsSchema)
        .mutation(async ({ ctx, input }) => {
            return input.measurements.map(async (measurement) => {
                return await ctx.db.measurement.upsert({
                    where: {
                        performanceId: input.performanceId,
                        id: measurement.id ? measurement.id : -1
                    },
                    create: {
                        value: measurement.value,
                        performance: {
                            connect: {
                                id: input.performanceId
                            }
                        }
                    },
                    update: {
                        value: measurement.value
                    }
                })
            })
        }),
});
