import type { AgeCoeficient as PrismaAgeCoeficient } from "@prisma/client";

export type AgeCoeficient = PrismaAgeCoeficient

export type AgeCoeficientPost = {
    age: number,
    coeficient: number,
    eventId: number
}

export type AgeCoeficientGet = {
    id: number
}

export type AgeCoeficientPatch = AgeCoeficientPost & AgeCoeficientGet

export type AgeCoeficientDelete = AgeCoeficientGet