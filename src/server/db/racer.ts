import { db } from "../db";
import type { Racer } from "../types/racer";

export async function createRacer(name: string, surname: string, birthDate: Date, sex: string, club: string): Promise<Racer> {
    return await db.racer.create({
        data: {
            name: name,
            surname: surname,
            birthDate: birthDate,
            sex: sex,
            club: club
        }
    })
}

export async function readRacer(id: number): Promise<Racer | null> {
    return await db.racer.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateRacer(id: number, name: string, surname: string, birthDate: Date, sex: string, club: string): Promise<Racer> {
    return await db.racer.update({
        where: {
            id: id
        },
        data: {
            name: name,
            surname: surname,
            birthDate: birthDate,
            sex: sex,
            club: club
        }
    })
}

export async function destroyRacer(id: number): Promise<Racer> {
    return await db.racer.delete({
        where: {
            id: id
        }
    })
}