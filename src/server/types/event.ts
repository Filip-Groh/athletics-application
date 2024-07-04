import type { Event as PrismaEvent } from "@prisma/client";

export type Event = PrismaEvent

export type EventPost = {
    name: string,
    category: string,
    raceId: number
}

export type EventGet = {
    id: number
}

export type EventPatch = EventPost & EventGet

export type EventDelete = EventGet