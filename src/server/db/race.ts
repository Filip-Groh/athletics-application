import { db } from "../db";
import type { Race, RacePreview } from "../types/race";

export async function createRace(name: string, date: Date, organizer: string, place: string, visible: boolean): Promise<RacePreview> {
    return await db.race.create({
        data: {
            name: name,
            date: date,
            organizer: organizer,
            place: place,
            visible: visible
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
                            racer: true,
                            measurement: true
                        }
                    },
                    ageCoeficient: true
                }
            },
            racer: true
        }
    })
}

export async function getRaces(includeHidden: boolean = false): Promise<RacePreview[]> {
    if (includeHidden) {
        return await db.race.findMany()
    }
    return await db.race.findMany({
        where: {
            visible: true
        }
    })
}

export async function updateRace(id: number, name: string, date: Date, organizer: string, place: string, visible: boolean): Promise<RacePreview> {
    return await db.race.update({
        where: {
            id: id
        },
        data: {
            name: name,
            date: date,
            organizer: organizer,
            place: place,
            visible: visible
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