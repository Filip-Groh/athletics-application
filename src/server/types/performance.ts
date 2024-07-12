import type { Performance as PrismaPerformance } from "@prisma/client";
import type { RacerPreview } from "./racer";
import { MeasurementPreview } from "./measurement";

export type PerformancePreview = PrismaPerformance

export type Performance = PerformancePreview & {
    racer: RacerPreview,
    measurement: Array<MeasurementPreview>
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