import { NextResponse } from 'next/server'
import type { Racer, RacerPost, RacerGet, RacerPatch, RacerDelete } from '~/server/types/racer'
import { createRacer, readRacer, updateRacer, destroyRacer } from '~/server/db/racer'

export async function POST(request: Request) {
    const data = await request.json() as RacerPost
    const createdRacer: Racer = await createRacer(data.name, data.surname, data.birthDate, data.sex, data.club)
    return NextResponse.json({data: createdRacer}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as RacerGet
    const racer: Racer | null = await readRacer(data.id)
    if (racer) {
        return NextResponse.json({data: racer}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as RacerPatch
    const racer: Racer = await updateRacer(data.id, data.name, data.surname, data.birthDate, data.sex, data.club)
    return NextResponse.json({data: racer}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as RacerDelete
    const racer: Racer = await destroyRacer(data.id)
    return NextResponse.json({data: racer}, { status: 200 })
}