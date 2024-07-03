import { NextResponse } from 'next/server'
import type { Race, RacePost, RaceGet, RacePatch, RaceDelete } from '~/server/types/race'
import { createRace, readRace, updateRace, destroyRace } from '~/server/db/race'

export async function POST(request: Request) {
    const data = await request.json() as RacePost
    const createdRace: Race = await createRace(data.name, data.date, data.organizer)
    return NextResponse.json({data: createdRace}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as RaceGet
    const race: Race | null = await readRace(data.id)
    if (race) {
        return NextResponse.json({data: race}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as RacePatch
    const race: Race = await updateRace(data.id, data.name, data.date, data.organizer)
    return NextResponse.json({data: race}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as RaceDelete
    const race: Race = await destroyRace(data.id)
    return NextResponse.json({data: race}, { status: 200 })
}