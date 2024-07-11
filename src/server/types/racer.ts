import type { Racer as PrismaRacer } from "@prisma/client";

export type RacerPreview = PrismaRacer

export type RacerPost = {
    name: string,
    surname: string,
    birthDate: Date,
    sex: string,
    club: string,
    raceId: string
}

export type RacerGet = {
    id: number
}

export type RacerPatch = RacerPost & RacerGet

export type RacerDelete = RacerGet