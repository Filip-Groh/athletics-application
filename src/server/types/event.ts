import type { Event as PrismaEvent } from "@prisma/client";
import type { PerformancePreview } from "./performance";
import type { AgeCoeficient } from "./ageCoeficient";

export type EventPreview = PrismaEvent

export type Event = EventPreview & {
    performance: Array<PerformancePreview>,
    ageCoeficient: Array<AgeCoeficient>
}

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