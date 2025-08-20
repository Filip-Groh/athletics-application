import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
    protectedProcedureEventManager,
    protectedProcedureRaceManager
} from "~/server/api/trpc";

const getRacesSchema = z.object({
    includeHidden: z.boolean()
})

const createRaceSchema = z.object({
    name: z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    }),
    date: z.date({
        required_error: "Musíte vybrat datum.",
    }),
    organizer: z.string().min(1, {
        message: "Jméno organizátora musí mít alespoň 1 znak."
    }),
    place: z.string().min(1, {
        message: "Místo konání musí mít alespoň 1 znak."
    }),
    visible: z.boolean()
})

const readRaceByIdSchema = z.object({
    id: z.number()
})

const updateRaceSchema = z.object({
    id: z.number(),
    name: z.optional(z.string().min(1, {
        message: "Jméno musí mít alespoň 1 znak."
    })),
    date: z.optional(z.date()),
    organizer: z.optional(z.string().min(1, {
        message: "Jméno organizátora musí mít alespoň 1 znak."
    })),
    place: z.optional(z.string().min(1, {
        message: "Místo konání musí mít alespoň 1 znak."
    })),
    visible: z.optional(z.boolean())
})

const getRaceEventsSchema = z.object({
    id: z.number()
})

const getRaceByIdPublicSchema = z.object({
    id: z.number()
})

const deleteRaceSchema = z.object({
    id: z.number()
})

const setRaceEventsSchema = z.object({
    raceId: z.number(),
    eventIds: z.array(z.number())
})

export const raceRouter = createTRPCRouter({
    getOwnedRaces: protectedProcedureEventManager
        .query(({ctx}) => {
            return ctx.db.race.findMany({
                where: {
                    ownerId: ctx.session.user.id
                }
            })
        }),

    getAssignedRaces: protectedProcedureEventManager
        .query(({ctx}) => {
            return ctx.db.race.findMany({
                where: {
                    managers: {
                        some: {
                            id: ctx.session.user.id
                        }
                    }
                }
            })
        }),

    getPublicRaces: publicProcedure
        .query(({ctx}) => {
            return ctx.db.race.findMany({
                where: {
                    visible: true
                }
            })
        }),

    createRace: protectedProcedureRaceManager
        .input(createRaceSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.race.create({
                data: {
                    name: input.name,
                    date: input.date,
                    organizer: input.organizer,
                    place: input.place,
                    visible: input.visible,
                    owner: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                }
            })
        }),

    getRaceEvents: publicProcedure
        .input(getRaceEventsSchema)
        .query(({ ctx, input }) => {
            return ctx.db.event.findMany({
                where: {
                    race: {
                        some: {
                            id: input.id
                        }
                    }
                },
                include: {
                    subEvent: true
                }
            })
        }),

    setRaceEvents: protectedProcedureRaceManager
        .input(setRaceEventsSchema)
        .mutation(({ ctx, input}) => {
            const events = input.eventIds.map((eventId) => {
                return {
                    id: eventId
                }
            })

            return ctx.db.race.update({
                where: {
                    id: input.raceId
                },
                data: {
                    event: {
                        set: events
                    }
                },
                include: {
                    _count: {
                        select: {
                            event: true
                        }
                    }
                }
            })
        }),














    getRaces: publicProcedure
        .input(getRacesSchema)
        .query(({ ctx, input }) => {
            if (input.includeHidden) {
                return ctx.db.race.findMany()
            }

            return ctx.db.race.findMany({
                where: {
                    visible: true
                }
            })
        }),

    getRaceByIdPublic: publicProcedure
        .input(getRaceByIdPublicSchema)
        .query(({ctx, input}) => {
            return ctx.db.race.findUnique({
                where: {
                    id: input.id,
                    visible: true
                },
                include: {
                    event: {
                        include: {
                            subEvent: {
                                include: {
                                    ageCoeficient: true,
                                    performance: {
                                        include: {
                                            measurement: true,
                                            racer: {
                                                include: {
                                                    personalData: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }),

    readRaceById: protectedProcedure
        .input(readRaceByIdSchema)
        .query(({ ctx, input }) => {
            return ctx.db.race.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    event: {
                        include: {
                            subEvent: {
                                include: {
                                    performance: {
                                        include: {
                                            racer: {
                                                include: {
                                                    personalData: true
                                                }
                                            },
                                            measurement: true
                                        }
                                    },
                                    ageCoeficient: {
                                        orderBy: {
                                            age: "asc"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    racer: {
                        include: {
                            performace: true,
                            personalData: true
                        }
                    }
                }
            })
        }),

    updateRace: protectedProcedure
        .input(updateRaceSchema)
        .mutation(({ ctx, input }) => {
            return ctx.db.race.update({
                where: {
                    id: input.id
                },
                data: {
                    ...input
                }
            })
        }),

    deleteRace: protectedProcedure
        .input(deleteRaceSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.race.delete({
                where: {
                    id: input.id
                }
            })
        })
});
