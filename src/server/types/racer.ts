import type { Racer as PrismaRacer } from "@prisma/client";

export type Racer = PrismaRacer

export type RacerPost = {
    name: string,
    surname: string,
    birthDate: Date,
    sex: string,
    club: string
}

export type RacerGet = {
    id: number
}

export type RacerPatch = RacerPost & RacerGet

export type RacerDelete = RacerGet