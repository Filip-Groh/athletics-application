import { createEventSchema, deleteEventSchema, updateEventSchema } from "~/schemas/event";
import {
    createTRPCRouter,
    protectedProcedure,
    protectedProcedureAdmin,
    protectedProcedureEventManager
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
    getEvents: protectedProcedureEventManager
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
