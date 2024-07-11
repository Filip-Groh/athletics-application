import { NextResponse } from 'next/server'
import type { PerformancePreview, PerformancePost, PerformanceGet, PerformancePatch, PerformanceDelete } from '~/server/types/performance'
import { createPerformance, readPerformance, updatePerformance, destroyPerformance } from '~/server/db/performance'

export async function POST(request: Request) {
    const data = await request.json() as PerformancePost
    const createdPerformance: PerformancePreview = await createPerformance(data.measurement, data.racerId, data.eventId)
    return NextResponse.json({data: createdPerformance}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as PerformanceGet
    const performance: PerformancePreview | null = await readPerformance(data.id)
    if (performance) {
        return NextResponse.json({data: performance}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as PerformancePatch
    const performance: PerformancePreview = await updatePerformance(data.id, data.measurement, data.racerId, data.eventId)
    return NextResponse.json({data: performance}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as PerformanceDelete
    const performance: PerformancePreview = await destroyPerformance(data.id)
    return NextResponse.json({data: performance}, { status: 200 })
}