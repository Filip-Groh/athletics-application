import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

const setPersonalDataToUserSchema = z.object({
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
    })
})

const updatePersonalDataOfUserSchema = z.object({
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
    })
})

export const personalData = createTRPCRouter({
    setPersonalDataToUser: protectedProcedure
        .input(setPersonalDataToUserSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.personalData.create({
                data: {
                    name: input.name,
                    surname: input.surname,
                    birthDate: input.birthDate,
                    sex: input.sex,
                    club: input.club,
                    user: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                }
            })
        }),

    updatePersonalDataOfUser: protectedProcedure
        .input(updatePersonalDataOfUserSchema)
        .mutation(({ctx, input}) => {
            return ctx.db.personalData.update({
                where: {
                    userId: ctx.session.user.id
                },
                data: {
                    name: input.name,
                    surname: input.surname,
                    birthDate: input.birthDate,
                    sex: input.sex,
                    club: input.club,
                }
            })
        }),

    deletePersonalDataOfUser: protectedProcedure
        .mutation(({ctx}) => {
            return ctx.db.personalData.delete({
                where: {
                    userId: ctx.session.user.id
                }
            })
        }),
});
