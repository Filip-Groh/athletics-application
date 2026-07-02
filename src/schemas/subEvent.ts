import { z } from "zod";

export const createSubEventSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    }),
    a: z.number(),
    b: z.number(),
    c: z.number(),
    eventId: z.number()
})

export const createSubEventWithEventSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    }),
    category: z.enum(["man", "woman"], {
        required_error: "Vyberte kategorii.",
    }),
    a: z.number(),
    b: z.number(),
    c: z.number()
})

export const updateSubEventSchema = z.object({
    id: z.number(),
    name: z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }),
    a: z.number(),
    b: z.number(),
    c: z.number()
})

export const deleteSubEventSchema = z.object({
    id: z.number()
})