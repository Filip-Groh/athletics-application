"use client"

import { notFound } from 'next/navigation'
import React from 'react'
import AnonymForm from '~/components/forms/attendance/anonymForm'
import { api } from '~/trpc/react'

function AnonymAttendRequestPage({ params }: { params: { raceId: string } }) {
    const {data, isSuccess, isLoading, error} = api.race.getRaceEvents.useQuery({
        id: Number(params.raceId)
    })

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        if (!data) {
            notFound()
        }

        return (
            <AnonymForm raceId={Number(params.raceId)} events={data}/>
        )
    }
}

export default AnonymAttendRequestPage