import { db } from "../db";
import type { MeasurementPreview } from "../types/measurement";

export async function createMeasurement(value: number, performanceId: number): Promise<MeasurementPreview> {
    return await db.measurement.create({
        data: {
            value: value,
            performance: {
                connect: {
                    id: performanceId
                }
            }
        }
    })
}

export async function readMeasurement(id: number): Promise<MeasurementPreview | null> {
    return await db.measurement.findFirst({
        where: {
            id: id
        }
    })
}

export async function updateMeasurement(id: number, value: number): Promise<MeasurementPreview> {
    return await db.measurement.update({
        where: {
            id: id
        },
        data: {
            value: value
        }
    })
}

export async function destroyMeasurement(id: number): Promise<MeasurementPreview> {
    return await db.measurement.delete({
        where: {
            id: id
        }
    })
}