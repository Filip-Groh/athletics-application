import { db } from "../db";
import type { RacerPreview } from "../types/racer";

export async function createRacer(name: string, surname: string, birthDate: Date, sex: string, club: string, raceId: number): Promise<RacerPreview> {
    return await db.racer.create({
        data: {
            name: name,
            surname: surname,
            birthDate: birthDate,
            sex: sex,
            club: club,
            race: {
                connect: {
                    id: raceId
                }
            }
        }
    })
}

export async function readRacer(id: number): Promise<RacerPreview | null> {
    return await db.racer.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateRacer(id: number, name: string, surname: string, birthDate: Date, sex: string, club: string, raceId: number): Promise<RacerPreview> {
    return await db.racer.update({
        where: {
            id: id
        },
        data: {
            name: name,
            surname: surname,
            birthDate: birthDate,
            sex: sex,
            club: club,
            race: {
                connect: {
                    id: raceId
                }
            }
        }
    })
}

export async function destroyRacer(id: number): Promise<RacerPreview> {
    return await db.racer.delete({
        where: {
            id: id
        }
    })
}