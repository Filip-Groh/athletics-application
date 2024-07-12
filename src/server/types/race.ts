import type { Race as PrismaRace } from "@prisma/client";
import type { Event } from "./event";
import type { RacerPreview } from "./racer";

export type RacePreview = PrismaRace

export type Race = RacePreview & {
    event: Array<Event>,
    racer: Array<RacerPreview>
}

export type RacePost = {
    name: string,
    date: Date,
    place: string,
    organizer: string,
    visible: boolean
}

export type RaceGet = {
    id: number
}

export type RacePatch = RacePost & RaceGet

export type RaceDelete = RaceGet