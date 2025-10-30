import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import PrehledClientPage from './clientPage'

async function PrehledPage({ params }: { params: { raceId: string } }) {
    const session = await getServerAuthSession()

    return (
        <PrehledClientPage raceId={Number(params.raceId)} userRole={session?.user.role ?? null} />
    )
}

export default PrehledPage