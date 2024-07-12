import { db } from "../db";
import type { EventPreview, Event } from "../types/event";

export async function createEvent(name: string, category: string, raceId: number): Promise<Event> {
    return await db.event.create({
        data: {
            name: name,
            category: category,
            race: {
                connect: {
                    id: raceId
                }
            }
        },
        include: {
            performance: {
                include: {
                    racer: true
                }
            },
            ageCoeficient: true
        }
    })
}

export async function readEvent(id: number): Promise<Event | null> {
    return await db.event.findFirst({
        where: {
            id: id
        },
        include: {
            performance: {
                include: {
                    racer: true
                }
            },
            ageCoeficient: true
        }
    })
}

export async function updateEvent(id: number, name: string, category: string, raceId: number): Promise<EventPreview> {
    return await db.event.update({
        where: {
            id: id
        },
        data: {
            name: name,
            category: category,
            race: {
                connect: {
                    id: raceId
                }
            }
        }
    })
}

export async function destroyEvent(id: number): Promise<EventPreview> {
    return await db.event.delete({
        where: {
            id: id
        }
    })
}