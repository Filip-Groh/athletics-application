import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedureAdmin
} from "~/server/api/trpc";

const addAgeCoeficientSchema = z.object({
    age: z.number(),
    ageCoeficients: z.array(z.object({
        coeficient: z.number(),
        subEventId: z.number()
    }))
})

const saveAgeCoeficientSchema = addAgeCoeficientSchema

const deleteAgeCoeficientSchema = z.object({
    age: z.number(),
    subEventIds: z.array(z.number())
})

export const ageCoeficientRouter = createTRPCRouter({
    addAgeCoeficients: protectedProcedureAdmin
        .input(addAgeCoeficientSchema)
        .mutation(async ({ ctx, input }) => {
            const newAgeCoeficients = input.ageCoeficients.map((ageCoeficient) => {
                return ctx.db.ageCoeficient.create({
                    data: {
                        age: input.age,
                        coeficient: ageCoeficient.coeficient,
                        subEvent: {
                            connect: {
                                id: ageCoeficient.subEventId
                            }
                        }
                    },
                    include: {
                        subEvent: true
                    }
                })
            })
            return await Promise.all(newAgeCoeficients)
        }),

    saveAgeCoeficient: protectedProcedureAdmin
        .input(saveAgeCoeficientSchema)
        .mutation(async ({ ctx, input }) => {
            const modifiedAgeCoeficients = input.ageCoeficients.map((ageCoeficient) => {
                return ctx.db.ageCoeficient.upsert({
                    where: {
                        age_subEventId: {
                            age: input.age,
                            subEventId: ageCoeficient.subEventId
                        }
                    },
                    create: {
                        age: input.age,
                        coeficient: ageCoeficient.coeficient,
                        subEvent: {
                            connect: {
                                id: ageCoeficient.subEventId
                            }
                        }
                    },
                    update: {
                        coeficient: ageCoeficient.coeficient
                    },
                    include: {
                        subEvent: true
                    }
                })
            })
            return await Promise.all(modifiedAgeCoeficients)
        }),

    deleteAgeCoeficient: protectedProcedureAdmin
        .input(deleteAgeCoeficientSchema)
        .mutation(async ({ctx, input}) => {
            const deletedAgeCoeficients = input.subEventIds.map((subEventId) => {
                return ctx.db.ageCoeficient.delete({
                    where: {
                        age_subEventId: {
                            age: input.age,
                            subEventId: subEventId
                        }
                    }
                })
            })
            return await Promise.all(deletedAgeCoeficients)
        })
});
