"use client"

import { notFound } from 'next/navigation'
import React from 'react'
import AnonymForm from '~/components/forms/attendance/anonymForm'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { api } from '~/trpc/react'

type AnonymAttendRequestPageProps = {
    params: {
        raceId: string
    }
}

const AnonymAttendRequestPage: React.FC<AnonymAttendRequestPageProps> = ({ params }) => {
    const getRaceEventsQuery = api.race.getRaceEvents.useQuery({
        id: Number(params.raceId)
    })

    return (
        <QueryWrapper
            query={getRaceEventsQuery}
            Empty={() => notFound()}
            Success={(data) => (
                <AnonymForm raceId={Number(params.raceId)} events={data} />
            )}
        />
    )
}

export default AnonymAttendRequestPage