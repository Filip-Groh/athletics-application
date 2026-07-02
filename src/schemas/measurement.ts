import { z } from "zod";

export const saveMeasurementsSchema = z.object({
    performanceId: z.number(),
    measurements: z.array(z.object({
        id: z.optional(z.number()),
        value: z.number().or(z.nan())
    }))
})

export const deleteMeasurementSchema = z.object({
    id: z.number(),
    index: z.number()
})