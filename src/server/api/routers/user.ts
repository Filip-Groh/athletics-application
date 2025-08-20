import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    protectedProcedureAdmin,
    protectedProcedureRaceManager
} from "~/server/api/trpc";
import { UserRole } from "~/server/auth";

const setUser = z.object({
    id: z.string().cuid()
})

const setManagingRaceSchema = z.object({
    id: z.string().cuid(),
    raceId: z.number(),
    isAssigned: z.boolean()
})

export const userRouter = createTRPCRouter({
    getUsers: protectedProcedure
        .query(({ctx}) => {
            return ctx.db.user.findMany()
        }),

    getEventManagers: protectedProcedureRaceManager
        .query(({ctx}) => {
            return ctx.db.user.findMany({
                where: {
                    id: {
                        not: {
                            equals: ctx.session.user.id
                        }
                    },
                    role: {
                        gte: UserRole.EventManager
                    }
                },
                include: {
                    managingRaces: true
                }
            })
        }),

    setManagingRace: protectedProcedureRaceManager
        .input(setManagingRaceSchema)
        .mutation(({ctx, input}) => {
            if (input.isAssigned) {
                return ctx.db.user.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        managingRaces: {
                            connect: {
                                id: input.raceId
                            }
                        }
                    }
                })
            } else {
                return ctx.db.user.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        managingRaces: {
                            disconnect: {
                                id: input.raceId
                            }
                        }
                    }
                })
            }
        }),

    setUserAdmin: protectedProcedureAdmin
        .input(setUser)
        .mutation(({ctx, input}) => {
            return ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    role: UserRole.Admin
                }
            })
        }),

    setUserRaceManager: protectedProcedureRaceManager
        .input(setUser)
        .mutation(({ctx, input}) => {
            return ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    role: UserRole.RaceManager
                }
            })
        }),

    setUserEventManager: protectedProcedureRaceManager
        .input(setUser)
        .mutation(({ctx, input}) => {
            return ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    role: UserRole.EventManager
                }
            })
        }),

    setUserRacer: protectedProcedureRaceManager
        .input(setUser)
        .mutation(({ctx, input}) => {
            return ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    role: UserRole.Racer
                }
            })
        })
});
