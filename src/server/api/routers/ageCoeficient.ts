import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const addAgeCoeficientSchema = z.object({
    age: z.number(),
    ageCoeficients: z.array(z.object({
        coeficient: z.number(),
        eventId: z.number()
    }))
})

export const ageCoeficientRouter = createTRPCRouter({
    addAgeCoeficients: protectedProcedure
        .input(addAgeCoeficientSchema)
        .mutation(({ ctx, input }) => {
            return input.ageCoeficients.map(async (ageCoeficient) => {
                return await ctx.db.ageCoeficient.create({
                    data: {
                        age: input.age,
                        coeficient: ageCoeficient.coeficient,
                        event: {
                            connect: {
                                id: ageCoeficient.eventId
                            }
                        }
                    }
                })
            })
        })
});
