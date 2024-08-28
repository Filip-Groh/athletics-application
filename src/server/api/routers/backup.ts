import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

const getBackupFileSchema = z.object({
    raceId: z.number()
})

const loadBackupFileSchema = z.object({
    raceId: z.number(),
    race: z.object({
        createdAt: z.date(),
        updatedAt: z.date(),
    
        name: z.string(),
        date: z.date(),
        place: z.string(),
        organizer: z.string(),
        visible: z.boolean(),
    
        event: z.array(z.object({
            id: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
    
            name: z.string(),
            category: z.string(),
    
            a: z.number(),
            b: z.number(),
            c: z.number(),
    
            ageCoeficient: z.array(z.object({
                id: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
    
                age: z.number(),
                coeficient: z.number()
            }))
        })),
    
        racer: z.array(z.object({
            id: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
    
            name: z.string(),
            surname: z.string(),
            birthDate: z.date(),
            sex: z.string(),
            club: z.string(),

            startingNumber: z.number(),
            orderNumber: z.number(),
            
            performace: z.array(z.object({
                id: z.number(),
                createdAt: z.date(),
                updatedAt: z.date(),
    
                eventId: z.number(),
    
                measurement: z.array(z.object({
                    id: z.number(),
                    createdAt: z.date(),
                    updatedAt: z.date(),
    
                    value: z.number()
                }))
            }))
        }))
    })
})

// type TypeEquality<T, U> = keyof T extends keyof U ? (keyof U extends keyof T ? true : false) : false;

// const sameTypeCheck = 

// assert()

// NonNullable<RouterOutputs["backup"]["getBackupFile"]> === z.infer<typeof loadBackupFileSchema>

export const backupRouter = createTRPCRouter({
    getBackupFile: protectedProcedure
        .input(getBackupFileSchema)
        .mutation(({ ctx, input }) => {
            return ctx.db.race.findUnique({
                where: {
                    id: input.raceId
                },
                include: {
                    event: {
                        include: {
                            ageCoeficient: true
                        }
                    },
                    racer: {
                        include: {
                            performace: {
                                include: {
                                    measurement: true
                                }
                            }
                        }
                    }
                }
            })
        }),

    loadBackupFile: protectedProcedure
        .input(loadBackupFileSchema)
        .mutation(async ({ ctx, input }) => {
            const race = await ctx.db.race.update({
                where: {
                    id: input.raceId
                },
                data: {
                    createdAt: input.race.createdAt,
                    updatedAt: input.race.updatedAt,

                    name: input.race.name,
                    date: input.race.date,
                    place: input.race.place,
                    organizer: input.race.organizer,
                    visible: input.race.visible,

                    event: {
                        deleteMany: {}
                    },
                    racer: {
                        deleteMany: {}
                    }
                }
            })

            const eventsIdMap = new Map<number, number>()
            const events = await ctx.db.event.createManyAndReturn({
                data: input.race.event.map((event) => {
                    return {
                        createdAt: event.createdAt,
                        updatedAt: event.updatedAt,
    
                        name: event.name,
                        category: event.category,
    
                        a: event.a,
                        b: event.b,
                        c: event.c,
                        
                        raceId: input.raceId
                    }
                }),
            })
            events.forEach((event, index) => {
                eventsIdMap.set(input.race.event[index]!.id, event.id)
            })

            const racers = await ctx.db.racer.createManyAndReturn({
                data: input.race.racer.map((racer) => {
                    return {
                        createdAt: racer.createdAt,
                        updatedAt: racer.updatedAt,

                        name: racer.name,
                        surname: racer.surname,
                        birthDate: racer.birthDate,
                        sex: racer.sex,
                        club: racer.club,

                        startingNumber: racer.startingNumber,
                        orderNumber: racer.orderNumber,

                        raceId: input.raceId
                    }
                })
            })

            const ageCoeficients = await Promise.all(events.map(async (event, index) => {
                return await ctx.db.ageCoeficient.createManyAndReturn({
                    data: input.race.event[index]!.ageCoeficient.map((ageCoeficient) => {
                        return {
                            createdAt: ageCoeficient.createdAt,
                            updatedAt: ageCoeficient.updatedAt,

                            age: ageCoeficient.age,
                            coeficient: ageCoeficient.coeficient,

                            eventId: event.id
                        }
                    })
                })
            }))

            const performances = await Promise.all(racers.map(async (racer, index) => {
                return await ctx.db.performance.createManyAndReturn({
                    data: input.race.racer[index]!.performace.map((performance) => {
                        return {
                            createdAt: performance.createdAt,
                            updatedAt: performance.updatedAt,

                            racerId: racer.id,
                            eventId: eventsIdMap.get(performance.eventId)!
                        }
                    })
                })
            }))

            const measurements = await Promise.all(racers.map(async (racer, racerIndex) => {
                return await ctx.db.measurement.createManyAndReturn({
                    data: performances.flatMap((performance, performanceIndex) => {
                        return input.race.racer[racerIndex]!.performace[performanceIndex]!.measurement.map((measurement) => {
                            return {
                                createdAt: measurement.createdAt,
                                updatedAt: measurement.updatedAt,

                                value: measurement.value,
                                performanceId: performance[performanceIndex]!.id
                            }
                        })
                    })
                })
            }))

            return {
                race: race,
                events: events,
                racers: racers,
                ageCoeficients: ageCoeficients,
                performances: performances,
                measurements: measurements
            }
        })
});
