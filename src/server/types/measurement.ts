import type { Measurement as PrismaMeasurement } from "@prisma/client";
import type { RacerPreview } from "./racer";

export type MeasurementPreview = PrismaMeasurement

export type Measurement = MeasurementPreview & {
    racer: RacerPreview
}

export type MeasurementPost = {
    value: number,
    performanceId: number
}

export type MeasurementGet = {
    id: number
}

export type MeasurementPatch = MeasurementPost & MeasurementGet

export type MeasurementDelete = MeasurementGet