"use client"

import React from 'react'
import EventManagersTable from '~/components/tables/eventManagersTable'
import { api } from '~/trpc/react'

function EventManagerTab({raceId}: {raceId: number}) {
    const {data, isSuccess, isLoading, error} = api.user.getEventManagers.useQuery()
    
    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        return (
            <EventManagersTable raceId={raceId} users={data}/>
        )
    }
}

export default EventManagerTab