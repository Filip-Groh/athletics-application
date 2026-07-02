import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import RaceOverviewClientPage from './clientPage'

type RaceOverviewPageProps = {
    params: {
        raceId: string
    }
}

const RaceOverviewPage: React.FC<RaceOverviewPageProps> = async ({ params }) => {
    return (
        <RaceOverviewClientPage raceId={Number(params.raceId)} isSession={(await getServerAuthSession()) !== null} />
    )
}

export default RaceOverviewPage