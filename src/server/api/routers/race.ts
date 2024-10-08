import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
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
    id: z.number(),
    sex: z.enum(["man", "woman"])
})

const getRaceByIdPublicSchema = z.object({
    id: z.number()
})

const deleteRaceSchema = z.object({
    id: z.number()
})

export const raceRouter = createTRPCRouter({
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

    getRaceEvents: publicProcedure
        .input(getRaceEventsSchema)
        .mutation(({ ctx, input }) => {
            return ctx.db.race.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    event: {
                        where: {
                            category: input.sex
                        }
                    }
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
                            ageCoeficient: true,
                            performance: {
                                include: {
                                    measurement: true,
                                    racer: true
                                }
                            }
                        }
                    }
                }
            })
        }),

    createRace: protectedProcedure
        .input(createRaceSchema)
        .mutation(({ ctx, input}) => {
            return ctx.db.race.create({
                data: {
                    name: input.name,
                    date: input.date,
                    organizer: input.organizer,
                    place: input.place,
                    visible: input.visible
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
                            performance: {
                                include: {
                                    racer: true,
                                    measurement: true
                                }
                            },
                            ageCoeficient: {
                                orderBy: {
                                    age: "asc"
                                }
                            }
                        }
                    },
                    racer: {
                        include: {
                            performace: true
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
