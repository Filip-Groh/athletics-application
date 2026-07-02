import { z } from "zod";

export const getPastRacesSchema = z.object({
    page: z.number().min(1),
    pageSize: z.number().min(1).max(100)
})

export const getRacesSchema = z.object({
    includeHidden: z.boolean()
})

export const createRaceSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }),
    date: z.date({
        required_error: "Musíte vybrat datum.",
    }),
    organizer: z.string().min(1, {
        message: "Jméno organizátora musí mít alespoň 1 znak."
    }),
    place: z.string().min(1, {
        message: "Místo konání musí mít alespoň 1 znak."
    }),
    visible: z.boolean()
})

export const readRaceByIdSchema = z.object({
    id: z.number()
})

export const updateRaceSchema = z.object({
    id: z.number(),
    name: z.optional(z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    })),
    date: z.optional(z.date()),
    organizer: z.optional(z.string().min(1, {
        message: "Jméno organizátora musí mít alespoň 1 znak."
    })),
    place: z.optional(z.string().min(1, {
        message: "Místo konání musí mít alespoň 1 znak."
    })),
    visible: z.optional(z.boolean())
})

export const getRaceEventsSchema = z.object({
    id: z.number()
})

export const getRaceByIdPublicSchema = z.object({
    id: z.number()
})

export const deleteRaceSchema = z.object({
    id: z.number()
})

export const setRaceEventsSchema = z.object({
    raceId: z.number(),
    eventIds: z.array(z.number())
})