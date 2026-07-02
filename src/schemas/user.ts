import { z } from "zod";

export const setUserSchema = z.object({
    id: z.string().cuid()
})

export const setManagingRaceSchema = z.object({
    id: z.string().cuid(),
    raceId: z.number(),
    isAssigned: z.boolean()
})