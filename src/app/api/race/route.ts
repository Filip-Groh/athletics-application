import { NextResponse } from 'next/server'
import type { Race, RacePreview, RacePost, RaceGet, RacePatch, RaceDelete } from '~/server/types/race'
import { createRace, readRace, updateRace, destroyRace } from '~/server/db/race'

export async function POST(request: Request) {
    const data = await request.json() as RacePost
    const createdRace: RacePreview = await createRace(data.name, data.date, data.organizer, data.place, false)
    return NextResponse.json({data: createdRace}, { status: 201 })
}

export async function PUT(request: Request) {
    const data = await request.json() as RaceGet
    const race: Race | null = await readRace(data.id)
    if (race) {
        return NextResponse.json({data: race}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as RacePatch
    const race: RacePreview = await updateRace(data.id, data.name, data.date, data.place, data.organizer, data.visible)
    return NextResponse.json({data: race}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as RaceDelete
    const race: RacePreview = await destroyRace(data.id)
    return NextResponse.json({data: race}, { status: 200 })
}