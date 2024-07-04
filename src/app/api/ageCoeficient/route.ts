import { NextResponse } from 'next/server'
import type { AgeCoeficient, AgeCoeficientPost, AgeCoeficientGet, AgeCoeficientPatch, AgeCoeficientDelete } from '~/server/types/ageCoeficient'
import { createAgeCoeficient, readAgeCoeficient, updateAgeCoeficient, destroyAgeCoeficient } from '~/server/db/ageCoeficient'

export async function POST(request: Request) {
    const data = await request.json() as AgeCoeficientPost
    const createdAgeCoeficient: AgeCoeficient = await createAgeCoeficient(data.age, data.coeficient, data.eventId)
    return NextResponse.json({data: createdAgeCoeficient}, { status: 201 })
}

export async function GET(request: Request) {
    const data = await request.json() as AgeCoeficientGet
    const ageCoeficient: AgeCoeficient | null = await readAgeCoeficient(data.id)
    if (ageCoeficient) {
        return NextResponse.json({data: ageCoeficient}, { status: 200 })
    }
    return NextResponse.json({ status: 204 })
}

export async function PATCH(request: Request) {
    const data = await request.json() as AgeCoeficientPatch
    const ageCoeficient: AgeCoeficient = await updateAgeCoeficient(data.id, data.age, data.coeficient, data.eventId)
    return NextResponse.json({data: ageCoeficient}, { status: 200 })
}

export async function DELETE(request: Request) {
    const data = await request.json() as AgeCoeficientDelete
    const ageCoeficient: AgeCoeficient = await destroyAgeCoeficient(data.id)
    return NextResponse.json({data: ageCoeficient}, { status: 200 })
}