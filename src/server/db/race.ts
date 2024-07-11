import { db } from "../db";
import type { Race, RacePreview } from "../types/race";

export async function createRace(name: string, date: Date, organizer: string): Promise<RacePreview> {
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
        },
        include: {
            event: {
                include: {
                    performance: {
                        include: {
                            racer: true
                        }
                    },
                    ageCoeficient: true
                }
            },
            racer: true
        }
    })
}

export async function getRaces(): Promise<RacePreview[]> {
    return await db.race.findMany()
}

export async function updateRace(id: number, name: string, date: Date, organizer: string): Promise<RacePreview> {
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

export async function destroyRace(id: number): Promise<RacePreview> {
    return await db.race.delete({
        where: {
            id: id
        }
    })
}