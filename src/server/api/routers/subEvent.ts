import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    protectedProcedureAdmin
} from "~/server/api/trpc";

const createSubEventSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    }),
    a: z.number(),
    b: z.number(),
    c: z.number(),
    eventId: z.number()
})

const createSubEventWithEventSchema = z.object({
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

const updateSubEventSchema = z.object({
    id: z.number(),
    name: z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }),
    a: z.number(),
    b: z.number(),
    c: z.number()
})

const deleteSubEventSchema = z.object({
    id: z.number()
})

export const subEventRouter = createTRPCRouter({
    // getSubEvents: protectedProcedure
    //     .query(({ctx}) => {
    //         return ctx.db.event.findMany()
    //     }),

    // getSubEventsWithAgeCoeficients: protectedProcedure
    //     .query(({ctx}) => {
    //         return ctx.db.event.findMany({
    //             include: {
    //                 subEvent: {
    //                     include: {
    //                         ageCoeficient: true
    //                     }
    //                 }
    //             }
    //         })
    //     }),

    createSubEvent: protectedProcedureAdmin
        .input(createSubEventSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.subEvent.create({
                data: {
                    name: input.name,
                    a: input.a,
                    b: input.b,
                    c: input.c,
                    event: {
                        connect: {
                            id: input.eventId
                        }
                    }
                },
                include: {
                    event: true
                }
            })
        }),

    createSubEventWithEvent: protectedProcedureAdmin
        .input(createSubEventWithEventSchema)
        .mutation(async ({ctx, input}) => {
            const event = await ctx.db.event.create({
                data: {
                    category: input.category
                }
            })

            return {
                category: event.category,
                ...await ctx.db.subEvent.create({
                    data: {
                        name: input.name,
                        a: input.a,
                        b: input.b,
                        c: input.c,
                        event: {
                            connect: {
                                id: event.id
                            }
                        }
                    }
            })}
        }),

    updateSubEvent: protectedProcedureAdmin
        .input(updateSubEventSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.subEvent.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    a: input.a,
                    b: input.b,
                    c: input.c
                },
                include: {
                    event: true
                }
            })
        }),

    deleteSubEvent: protectedProcedureAdmin
        .input(deleteSubEventSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.subEvent.delete({
                where: {
                    id: input.id,
                },
                include: {
                    event: true
                }
            })
        })
});