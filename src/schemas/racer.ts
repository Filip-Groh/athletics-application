import { z } from "zod";

export const getStartingNumberSchema = z.object({
    raceId: z.number()
})

export const disconnectRacerSchema = z.object({
    raceId: z.number(),
    racerId: z.number(),
    eventId: z.number()
})

export const changeRacersOrderNumberSchema = z.array(z.object({
    performanceId: z.number(),
    newOrderNumber: z.number()
}))

export const createRacerWithUsersPersonalInformationSchema = z.object({
    raceId: z.number(),
    event: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "Vyberte si alespoň 1 disciplínu.",
    })
})

export const createRacerWithFormDataSchema = z.object({
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

export const deleteRacerSchema = z.object({
    racerId: z.number()
})