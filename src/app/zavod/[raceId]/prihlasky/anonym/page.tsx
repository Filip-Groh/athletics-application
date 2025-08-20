import { notFound } from 'next/navigation'
import React from 'react'
import AnonymForm from '~/components/forms/attendance/anonymForm'
import { api } from '~/trpc/server'

async function AnonymAttendRequestPage({ params }: { params: { raceId: string } }) {
    const events = await api.race.getRaceEvents({
        id: Number(params.raceId)
    })

    if (!events) {
        notFound()
    }

    return (
        <AnonymForm raceId={Number(params.raceId)} events={events}/>
    )
}

export default AnonymAttendRequestPage