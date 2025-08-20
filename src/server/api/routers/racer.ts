import { type PrismaClient } from "@prisma/client";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    protectedProcedureEventManager,
    protectedProcedureRaceManager,
    publicProcedure,
} from "~/server/api/trpc";

// const createRacerSchema = z.object({
//     name: z.string().min(1, {
//         message: "Jméno musí mít alespoň 1 znak.",
//     }),
//     surname: z.string().min(1, {
//         message: "Příjmení musí mít alespoň 1 znak.",
//     }),
//     birthDate: z.date({
//         required_error: "Musíte vybrat datum narození.",
//     }),
//     sex: z.enum(["man", "woman"], {
//         required_error: "Vyberte pohlaví.",
//     }),
//     club: z.string().min(1, {
//         message: "Jméno oddílu musí mít alespoň 1 znak.",
//     }),
//     raceId: z.number({
//         required_error: "Zvolte si závod."
//     }),
//     event: z.array(z.number()).refine((value) => value.some((item) => item), {
//         message: "Vyberte si alespoň 1 disciplínu.",
//     })
// })

const disconnectRacerSchema = z.object({
    raceId: z.number(),
    racerId: z.number(),
    eventId: z.number()
})

const changeRacersOrderNumberSchema = z.array(z.object({
    performanceId: z.number(),
    newOrderNumber: z.number()
}))

const createRacerWithUsersPersonalInformationSchema = z.object({
    raceId: z.number(),
    event: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "Vyberte si alespoň 1 disciplínu.",
    })
})

const createRacerWithFormDataSchema = z.object({
    raceId: z.number(),
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
    event: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "Vyberte si alespoň 1 disciplínu.",
    })
})

const deleteRacerSchema = z.object({
    racerId: z.number()
})

async function getNextStartingNumber(db: PrismaClient, raceId: number) {
    const existingRacersNumbers = await db.racer.findMany({
        where: {
            raceId: raceId
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

    return startingNumber
}

async function getNextOrderNumber(db: PrismaClient, raceId: number, subEventId: number) {
    const existingOrderNumbers = await db.performance.findMany({
        where: {
            raceId: raceId,
            subEventId: subEventId
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

    return orderNumber
}

export const racerRouter = createTRPCRouter({
    createRacerWithUsersPersonalInformation: protectedProcedure
        .input(createRacerWithUsersPersonalInformationSchema)
        .mutation(async ({ctx, input}) => {
            if (ctx.session.user.personalData?.id === undefined) {
                throw new Error("No user attached personal information!")
            }

            const startingNumber = await getNextStartingNumber(ctx.db, input.raceId)

            const racer = await ctx.db.racer.create({
                data: {
                    personalDataId: ctx.session.user.personalData.id,
                    startingNumber: startingNumber,
                    raceId: input.raceId
                }
            })

            const createPerformance = async (subEventId: number) => {
                await ctx.db.performance.create({
                    data: {
                        orderNumber: await getNextOrderNumber(ctx.db, input.raceId, subEventId),
                        race: {
                            connect: {
                                id: input.raceId
                            }
                        },
                        racer: {
                            connect: {
                                id: racer.id
                            }
                        },
                        subEvent: {
                            connect: {
                                id: subEventId
                            }
                        }
                    }
                })
            }

            for (const eventId of input.event) {
                const event = await ctx.db.event.findUnique({
                    where: {
                        id: eventId
                    },
                    include: {
                        subEvent: true
                    }
                })

                await Promise.all((event?.subEvent ?? []).map((subEvent) => {
                    return createPerformance(subEvent.id)
                }))
            }

            return racer
        }),

    createRacerWithFormData: publicProcedure
        .input(createRacerWithFormDataSchema)
        .mutation(async ({ctx, input}) => {
            const startingNumber = await getNextStartingNumber(ctx.db, input.raceId)

            const racer = await ctx.db.racer.create({
                data: {
                    personalData: {
                        create: {
                            name: input.name,
                            surname: input.surname,
                            birthDate: input.birthDate,
                            sex: input.sex,
                            club: input.club
                        }
                    },
                    startingNumber: startingNumber,
                    race: {
                        connect: {
                            id: input.raceId
                        }
                    }
                }
            })

            const createPerformance = async (subEventId: number) => {
                await ctx.db.performance.create({
                    data: {
                        orderNumber: await getNextOrderNumber(ctx.db, input.raceId, subEventId),
                        race: {
                            connect: {
                                id: input.raceId
                            }
                        },
                        racer: {
                            connect: {
                                id: racer.id
                            }
                        },
                        subEvent: {
                            connect: {
                                id: subEventId
                            }
                        }
                    }
                })
            }

            for (const eventId of input.event) {
                const events = await ctx.db.event.findUnique({
                    where: {
                        id: eventId
                    },
                    include: {
                        subEvent: true
                    }
                })

                await Promise.all((events?.subEvent ?? []).map((subEvent) => {
                    return createPerformance(subEvent.id)
                }))
            }

            return racer
        }),

    deleteRacer: protectedProcedureRaceManager
        .input(deleteRacerSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.racer.delete({
                where: {
                    id: input.racerId
                },
                include: {
                    personalData: true
                }
            })
        }),

    disconnectRacer: protectedProcedureEventManager
        .input(disconnectRacerSchema)
        .mutation(async ({ctx, input}) => {
            const event = await ctx.db.event.findUnique({
                where: {
                    id: input.eventId
                },
                include: {
                    subEvent: true
                }
            })

            const deletePerformance = async (subEventId: number) => {
                return await ctx.db.performance.delete({
                    where: {
                        racerId_subEventId_raceId: {
                            raceId: input.raceId,
                            racerId: input.racerId,
                            subEventId: subEventId
                        }
                    },
                    include: {
                        racer: {
                            include: {
                                personalData: true
                            }
                        },
                        subEvent: true
                    }
                })
            }

            const performances = await Promise.all((event?.subEvent ?? []).map((subEvent) => {
                return deletePerformance(subEvent.id)
            }))
            
            return {
                racer: performances[0]?.racer,
                subEventCount: performances.length
            }
        }),

    changeRacersOrderNumber: protectedProcedureEventManager
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



    // createRacer: publicProcedure
    //     .input(createRacerSchema)
    //     .mutation(async ({ ctx, input}) => {
    //         const existingRacersNumbers = await ctx.db.racer.findMany({
    //             where: {
    //                 raceId: input.raceId
    //             },
    //             select: {
    //                 startingNumber: true
    //             }
    //         })

    //         let startingNumber = 1
    //         while (true) {
    //             let startingNumberExist = false
    //             for (const existingRacersNumber of existingRacersNumbers) {
    //                 startingNumberExist = startingNumberExist || startingNumber === existingRacersNumber.startingNumber

    //                 if (startingNumberExist) {
    //                     break
    //                 }
    //             }

    //             startingNumber += startingNumberExist ? 1 : 0

    //             if (!startingNumberExist) {
    //                 break
    //             }
    //         }

    //         const createdRacer = await ctx.db.racer.create({
    //             data: {
    //                 name: input.name,
    //                 surname: input.surname,
    //                 birthDate: input.birthDate,
    //                 sex: input.sex,
    //                 club: input.club,

    //                 startingNumber: startingNumber,

    //                 race: {
    //                     connect: {
    //                         id: input.raceId
    //                     }
    //                 }
    //             },
    //             include: {
    //                 race: true
    //             }
    //         })

    //         const createPerformance = async (eventId: number) => {
    //             const existingOrderNumbers = await ctx.db.performance.findMany({
    //                 where: {
    //                     eventId: eventId
    //                 },
    //                 select: {
    //                     orderNumber: true
    //                 }
    //             })
    
    //             let orderNumber = 1
    //             while (true) {
    //                 let orderNumberExist = false
    //                 for (const existingOrderNumber of existingOrderNumbers) {
    //                     orderNumberExist = orderNumberExist || orderNumber === existingOrderNumber.orderNumber
    
    //                     if (orderNumberExist) {
    //                         break
    //                     }
    //                 }
    
    //                 orderNumber += orderNumberExist ? 1 : 0
    
    //                 if (!orderNumberExist) {
    //                     break
    //                 }
    //             }

    //             await ctx.db.performance.create({
    //                 data: {
    //                     orderNumber: orderNumber,
    //                     racer: {
    //                         connect: {
    //                             id: createdRacer.id
    //                         }
    //                     },
    //                     event: {
    //                         connect: {
    //                             id: eventId
    //                         }
    //                     }
    //                 }
    //             })
    //         }

    //         input.event.forEach((eventId) => {
    //             void createPerformance(eventId)
    //         })

    //         return createdRacer
    //     }),

    // deleteRacer: protectedProcedure
    //     .input(deleteRacerSchema)
    //     .mutation(({ ctx, input}) => {
    //         return ctx.db.racer.delete({
    //             where: {
    //                 id: input.racerId
    //             }
    //         })
    //     }),
});
