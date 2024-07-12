import { NextResponse } from 'next/server'
import type { RacerPreview, RacerPost, RacerGet, RacerPatch, RacerDelete } from '~/server/types/racer'
import { createRacer, readRacer, updateRacer, destroyRacer } from '~/server/db/racer'
import { createPerformance } from '~/server/db/performance'

export async function POST(request: Request) {
    const data = await request.json() as RacerPost
    const createdRacer: RacerPreview = await createRacer(data.name, data.surname, data.birthDate, data.sex, data.club, Number(data.raceId))
    data.event.forEach((eventId) => {
        void createPerformance(createdRacer.id, Number(eventId))
    })
    return NextResponse.json({data: createdRacer}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as RacerGet
    const racer: RacerPreview | null = await readRacer(data.id)
    if (racer) {
        return NextResponse.json({data: racer}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as RacerPatch
    const racer: RacerPreview = await updateRacer(data.id, data.name, data.surname, data.birthDate, data.sex, data.club, Number(data.raceId))
    return NextResponse.json({data: racer}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as RacerDelete
    const racer: RacerPreview = await destroyRacer(data.id)
    return NextResponse.json({data: racer}, { status: 200 })
}