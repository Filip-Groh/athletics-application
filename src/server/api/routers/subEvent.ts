import { createSubEventSchema, createSubEventWithEventSchema, deleteSubEventSchema, updateSubEventSchema } from "~/schemas/subEvent";
import {
    createTRPCRouter,
    protectedProcedureAdmin
} from "~/server/api/trpc";

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