import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    protectedProcedureAdmin
} from "~/server/api/trpc";

const createEventSchema = z.object({
    name: z.optional(z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    })),
    category: z.enum(["man", "woman"], {
        required_error: "Vyberte kategorii.",
    })
})

const updateEventSchema = z.object({
    id: z.number(),
    name: z.optional(z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }))
})

const deleteEventSchema = z.object({
    id: z.number()
})

export const eventRouter = createTRPCRouter({
    getEvents: protectedProcedureAdmin
        .query(({ctx}) => {
            return ctx.db.event.findMany({
                include: {
                    subEvent: true
                }
            })
        }),

    getEventsWithAgeCoeficients: protectedProcedure
        .query(({ctx}) => {
            return ctx.db.event.findMany({
                include: {
                    subEvent: {
                        include: {
                            ageCoeficient: true
                        }
                    }
                }
            })
        }),

    createEvent: protectedProcedureAdmin
        .input(createEventSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.event.create({
                data: {
                    name: input.name,
                    category: input.category,
                }
            })
        }),

    updateEvent: protectedProcedureAdmin
        .input(updateEventSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.event.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name
                }
            })
        }),

    deleteEvent: protectedProcedureAdmin
        .input(deleteEventSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.event.delete({
                where: {
                    id: input.id,
                },
                include: {
                    subEvent: true
                }
            })
        })
});
