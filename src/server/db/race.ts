import { db } from "../db";
import type { Race } from "../types/race";

export async function createRace(name: string, date: Date, organizer: string): Promise<Race> {
    return await db.race.create({
        data: {
            name: name,
            date: date,
            organizer: organizer,
        }
    })
}

export async function readRace(id: number): Promise<Race | null> {
    return await db.race.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateRace(id: number, name: string, date: Date, organizer: string): Promise<Race> {
    return await db.race.update({
        where: {
            id: id
        },
        data: {
            name: name,
            date: date,
            organizer: organizer
        }
    })
}

export async function destroyRace(id: number) {
    return await db.race.delete({
        where: {
            id: id
        }
    })
}