import { db } from "../db";
import type { PerformancePreview } from "../types/performance";

export async function createPerformance(measurement: number, racerId: number, eventId: number): Promise<PerformancePreview> {
    return await db.performance.create({
        data: {
            measurement: measurement,
            racer: {
                connect: {
                    id: racerId
                }
            },
            event: {
                connect: {
                    id: eventId
                }
            }
        }
    })
}

export async function readPerformance(id: number): Promise<PerformancePreview | null> {
    return await db.performance.findFirst({
        where: {
            id: id
        }
    })
}

export async function updatePerformance(id: number, measurement: number, racerId: number, eventId: number): Promise<PerformancePreview> {
    return await db.performance.update({
        where: {
            id: id
        },
        data: {
            measurement: measurement,
            racer: {
                connect: {
                    id: racerId
                }
            },
            event: {
                connect: {
                    id: eventId
                }
            }
        }
    })
}

export async function destroyPerformance(id: number): Promise<PerformancePreview> {
    return await db.performance.delete({
        where: {
            id: id
        }
    })
}