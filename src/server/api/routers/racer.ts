import { z } from "zod";

import {
    createTRPCRouter,
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

export const racerRouter = createTRPCRouter({
    createRacer: publicProcedure
        .input(createRacerSchema)
        .mutation(async ({ ctx, input}) => {
            const createdRacer = await ctx.db.racer.create({
                data: {
                    name: input.name,
                    surname: input.surname,
                    birthDate: input.birthDate,
                    sex: input.sex,
                    club: input.club,
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
                await ctx.db.performance.create({
                    data: {
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
});
