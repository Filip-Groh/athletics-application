import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";

const createEventSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno disciplíny musí mít alespoň 1 znak.",
    }),
    category: z.enum(["man", "woman"], {
        required_error: "Vyberte kategorii.",
    }),
    raceId: z.number(),
    a: z.number(),
    b: z.number(),
    c: z.number()
})

export const eventRouter = createTRPCRouter({
    createEvent: protectedProcedure
        .input(createEventSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.event.create({
                data: {
                    name: input.name,
                    category: input.category,
                    a: input.a,
                    b: input.b,
                    c: input.c,
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
