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

const saveAgeCoeficientSchema = addAgeCoeficientSchema

export const ageCoeficientRouter = createTRPCRouter({
    addAgeCoeficients: protectedProcedure
        .input(addAgeCoeficientSchema)
        .mutation(async ({ ctx, input }) => {
            const newAgeCoeficients = input.ageCoeficients.map((ageCoeficient) => {
                return ctx.db.ageCoeficient.create({
                    data: {
                        age: input.age,
                        coeficient: ageCoeficient.coeficient,
                        event: {
                            connect: {
                                id: ageCoeficient.eventId
                            }
                        }
                    },
                    include: {
                        event: true
                    }
                })
            })
            return await Promise.all(newAgeCoeficients)
        }),

    saveAgeCoeficient: protectedProcedure
        .input(saveAgeCoeficientSchema)
        .mutation(async ({ ctx, input }) => {
            const modifiedAgeCoeficients = input.ageCoeficients.map((ageCoeficient) => {
                return ctx.db.ageCoeficient.upsert({
                    where: {
                        age_eventId: {
                            age: input.age,
                            eventId: ageCoeficient.eventId
                        }
                    },
                    create: {
                        age: input.age,
                        coeficient: ageCoeficient.coeficient,
                        event: {
                            connect: {
                                id: ageCoeficient.eventId
                            }
                        }
                    },
                    update: {
                        coeficient: ageCoeficient.coeficient
                    },
                    include: {
                        event: true
                    }
                })
            })
            return await Promise.all(modifiedAgeCoeficients)
        })
});
