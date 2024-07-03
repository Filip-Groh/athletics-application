import type { Race as PrismaRace } from "@prisma/client";

export type Race = PrismaRace

export type RacePost = {
    name: string,
    date: Date,
    organizer: string
}

export type RaceGet = {
    id: number
}

export type RacePatch = RacePost & RaceGet

export type RaceDelete = RaceGet