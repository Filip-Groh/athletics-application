import { setPersonalDataToUserSchema, updatePersonalDataOfUserSchema } from "~/schemas/personalData";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

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
