import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import RaceOverviewClientPage from './clientPage'

async function RaceOverviewPage({ params }: { params: { raceId: string } }) {
    return (
        <RaceOverviewClientPage raceId={Number(params.raceId)} isSession={(await getServerAuthSession()) !== null} />
    )
}

export default RaceOverviewPage