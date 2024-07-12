import { NextResponse } from 'next/server'
import type { EventPreview, EventPost, EventGet, EventPatch, EventDelete, Event } from '~/server/types/event'
import { createEvent, readEvent, updateEvent, destroyEvent } from '~/server/db/event'

export async function POST(request: Request) {
    const data = await request.json() as EventPost
    const createdEvent: Event = await createEvent(data.name, data.category, data.raceId)
    return NextResponse.json({data: createdEvent}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as EventGet
    const event: EventPreview | null = await readEvent(data.id)
    if (event) {
        return NextResponse.json({data: event}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as EventPatch
    const event: EventPreview = await updateEvent(data.id, data.name, data.category, data.raceId)
    return NextResponse.json({data: event}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as EventDelete
    const event: EventPreview = await destroyEvent(data.id)
    return NextResponse.json({data: event}, { status: 200 })
}