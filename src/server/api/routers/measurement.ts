import { deleteMeasurementSchema, saveMeasurementsSchema } from "~/schemas/measurement";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const measurementRouter = createTRPCRouter({
    saveMeasurementsOnPerformance: protectedProcedure
        .input(saveMeasurementsSchema)
        .mutation(async ({ ctx, input }) => {
            const newMeasuement = input.measurements.map(async (measurement) => {
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
            return await Promise.all(newMeasuement)
        }),

    deleteMeasurement: protectedProcedure
        .input(deleteMeasurementSchema)
        .mutation(({ctx, input}) => {
            return {measurement: ctx.db.measurement.delete({
                where: {
                    id: input.id
                }
            }), index: input.index}
        })
});
