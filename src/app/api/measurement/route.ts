import { NextResponse } from 'next/server'
import type { MeasurementPreview, MeasurementPost, MeasurementGet, MeasurementPatch, MeasurementDelete } from '~/server/types/measurement'
import { createMeasurement, readMeasurement, updateMeasurement, destroyMeasurement } from '~/server/db/measurement'

export async function POST(request: Request) {
    const data = await request.json() as MeasurementPost
    const createdMeasurement: MeasurementPreview = await createMeasurement(data.value, data.performanceId)
    return NextResponse.json({data: createdMeasurement}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as MeasurementGet
    const measurement: MeasurementPreview | null = await readMeasurement(data.id)
    if (measurement) {
        return NextResponse.json({data: measurement}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as MeasurementPatch
    const measurement: MeasurementPreview = await updateMeasurement(data.id, data.value)
    return NextResponse.json({data: measurement}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as MeasurementDelete
    const measurement: MeasurementPreview = await destroyMeasurement(data.id)
    return NextResponse.json({data: measurement}, { status: 200 })
}