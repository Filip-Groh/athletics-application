import { z } from "zod";

export const addAgeCoeficientSchema = z.object({
    age: z.number(),
    ageCoeficients: z.array(z.object({
        coeficient: z.number(),
        subEventId: z.number()
    }))
})

export const saveAgeCoeficientSchema = addAgeCoeficientSchema

export const deleteAgeCoeficientSchema = z.object({
    age: z.number(),
    subEventIds: z.array(z.number())
})