import { z } from "zod";

export const createEventSchema = z.object({
    name: z.optional(z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    })),
    category: z.enum(["man", "woman"], {
        required_error: "Vyberte kategorii.",
    })
})

export const updateEventSchema = z.object({
    id: z.number(),
    name: z.optional(z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }))
})

export const deleteEventSchema = z.object({
    id: z.number()
})