"use client"

import React from 'react'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import EventManagersTable from '~/components/tables/eventManagersTable'
import { api } from '~/trpc/react'

type EventManagerTabProps = {
    raceId: number
}

const EventManagerTab: React.FC<EventManagerTabProps> = ({ raceId }) => {
    const getEventManagersQuery = api.user.getEventManagers.useQuery()

    return (
        <QueryWrapper
            query={getEventManagersQuery}
            Success={(data) => (
                <EventManagersTable raceId={raceId} users={data} />
            )}
        />
    )
}

export default EventManagerTab