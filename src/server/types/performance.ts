import type { Performance as PrismaPerformance } from "@prisma/client";
import type { RacerPreview } from "./racer";

export type PerformancePreview = PrismaPerformance

export type Performance = PerformancePreview & {
    racer: RacerPreview
}

export type PerformancePost = {
    measurement: number,
    racerId: number,
    eventId: number
}

export type PerformanceGet = {
    id: number
}

export type PerformancePatch = PerformancePost & PerformanceGet

export type PerformanceDelete = PerformanceGet