import { db } from "../db";
import type { AgeCoeficient } from "../types/ageCoeficient";

export async function createAgeCoeficient(age: number, coeficient: number, eventId: number): Promise<AgeCoeficient> {
    return await db.ageCoeficient.create({
        data: {
            age: age,
            coeficient: coeficient,
            event: {
                connect: {
                    id: eventId
                }
            }
        }
    })
}

export async function readAgeCoeficient(id: number): Promise<AgeCoeficient | null> {
    return await db.ageCoeficient.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateAgeCoeficient(id: number, age: number, coeficient: number, eventId: number): Promise<AgeCoeficient> {
    return await db.ageCoeficient.update({
        where: {
            id: id
        },
        data: {
            age: age,
            coeficient: coeficient,
            event: {
                connect: {
                    id: eventId
                }
            }
        }
    })
}

export async function destroyAgeCoeficient(id: number): Promise<AgeCoeficient> {
    return await db.ageCoeficient.delete({
        where: {
            id: id
        }
    })
}