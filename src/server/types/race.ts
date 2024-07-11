import type { Race as PrismaRace } from "@prisma/client";
import type { EventPreview } from "./event";
import type { RacerPreview } from "./racer";

export type RacePreview = PrismaRace

export type Race = RacePreview & {
    event: Array<EventPreview>,
    racer: Array<RacerPreview>
}

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