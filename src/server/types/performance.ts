import type { Performance as PrismaPerformance } from "@prisma/client";

export type Performance = PrismaPerformance

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