import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const createRacerSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak.",
    }),
    surname: z.string().min(1, {
        message: "Příjmení musí mít alespoň 1 znak.",
    }),
    birthDate: z.date({
        required_error: "Musíte vybrat datum narození.",
    }),
    sex: z.enum(["man", "woman"], {
        required_error: "Vyberte pohlaví.",
    }),
    club: z.string().min(1, {
        message: "Jméno oddílu musí mít alespoň 1 znak.",
    }),
    raceId: z.number({
        required_error: "Zvolte si závod."
    }),
    event: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "Vyberte si alespoň 1 disciplínu.",
    })
})

const deleteRacerSchema = z.object({
    racerId: z.number()
})

const disconnectRacerSchema = z.object({
    racerId: z.number(),
    eventId: z.number()
})

const changeRacersOrderNumberSchema = z.array(z.object({
    performanceId: z.number(),
    newOrderNumber: z.number()
}))

export const racerRouter = createTRPCRouter({
    createRacer: publicProcedure
        .input(createRacerSchema)
        .mutation(async ({ ctx, input}) => {
            const existingRacersNumbers = await ctx.db.racer.findMany({
                where: {
                    raceId: input.raceId
                },
                select: {
                    startingNumber: true
                }
            })

            let startingNumber = 1
            while (true) {
                let startingNumberExist = false
                for (const existingRacersNumber of existingRacersNumbers) {
                    startingNumberExist = startingNumberExist || startingNumber === existingRacersNumber.startingNumber

                    if (startingNumberExist) {
                        break
                    }
                }

                startingNumber += startingNumberExist ? 1 : 0

                if (!startingNumberExist) {
                    break
                }
            }

            const createdRacer = await ctx.db.racer.create({
                data: {
                    name: input.name,
                    surname: input.surname,
                    birthDate: input.birthDate,
                    sex: input.sex,
                    club: input.club,

                    startingNumber: startingNumber,

                    race: {
                        connect: {
                            id: input.raceId
                        }
                    }
                },
                include: {
                    race: true
                }
            })

            const createPerformance = async (eventId: number) => {
                const existingOrderNumbers = await ctx.db.performance.findMany({
                    where: {
                        eventId: eventId
                    },
                    select: {
                        orderNumber: true
                    }
                })
    
                let orderNumber = 1
                while (true) {
                    let orderNumberExist = false
                    for (const existingOrderNumber of existingOrderNumbers) {
                        orderNumberExist = orderNumberExist || orderNumber === existingOrderNumber.orderNumber
    
                        if (orderNumberExist) {
                            break
                        }
                    }
    
                    orderNumber += orderNumberExist ? 1 : 0
    
                    if (!orderNumberExist) {
                        break
                    }
                }

                await ctx.db.performance.create({
                    data: {
                        orderNumber: orderNumber,
                        racer: {
                            connect: {
                                id: createdRacer.id
                            }
                        },
                        event: {
                            connect: {
                                id: eventId
                            }
                        }
                    }
                })
            }

            input.event.forEach((eventId) => {
                void createPerformance(eventId)
            })

            return createdRacer
        }),

    deleteRacer: protectedProcedure
        .input(deleteRacerSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.racer.delete({
                where: {
                    id: input.racerId
                }
            })
        }),

    disconnectRacer: protectedProcedure
        .input(disconnectRacerSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.performance.delete({
                where: {
                    racerId_eventId: {
                        racerId: input.racerId,
                        eventId: input.eventId
                    }
                },
                include: {
                    racer: true,
                    event: true
                }
            })
        }),

    changeRacersOrderNumber: protectedProcedure
        .input(changeRacersOrderNumberSchema)
        .mutation(({ctx, input}) => {
            return input.map(async (newOrder) => {
                return await ctx.db.performance.update({
                    where: {
                        id: newOrder.performanceId
                    },
                    data: {
                        orderNumber: newOrder.newOrderNumber
                    }
                })
            })
        })
});
