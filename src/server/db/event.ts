import { db } from "../db";
import type { Event } from "../types/event";

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
        }
    })
}

export async function readEvent(id: number): Promise<Event | null> {
    return await db.event.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateEvent(id: number, name: string, category: string, raceId: number): Promise<Event> {
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

export async function destroyEvent(id: number): Promise<Event> {
    return await db.event.delete({
        where: {
            id: id
        }
    })
}