import { z } from "zod";

export const setPersonalDataToUserSchema = z.object({
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

export const updatePersonalDataOfUserSchema = z.object({
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