import { db } from "../db";
import type { Performance } from "../types/performance";

export async function createPerformance(measurement: number, racerId: number, eventId: number): Promise<Performance> {
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

export async function readPerformance(id: number): Promise<Performance | null> {
    return await db.performance.findFirst({
        where: {
            id: id
        }
    })
}

export async function updatePerformance(id: number, measurement: number, racerId: number, eventId: number): Promise<Performance> {
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

export async function destroyPerformance(id: number): Promise<Performance> {
    return await db.performance.delete({
        where: {
            id: id
        }
    })
}