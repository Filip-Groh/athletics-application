import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";

const createEventSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    }),
    category: z.string().min(1, {
        message: "Kategorie musí mít alespoň 1 znak.",
    }),
    raceId: z.number()
})

export const eventRouter = createTRPCRouter({
    createEvent: protectedProcedure
        .input(createEventSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.event.create({
                data: {
                    name: input.name,
                    category: input.category,
                    race: {
                        connect: {
                            id: input.raceId
                        }
                    }
                },
                include: {
                    performance: {
                        include: {
                            racer: true,
                            measurement: true
                        }
                    }
                }
            })
        }),
});
