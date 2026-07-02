import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import PrehledClientPage from './clientPage'

type PrehledPageProps = {
    params: {
        raceId: string
    }
}

const PrehledPage: React.FC<PrehledPageProps> = async ({ params }) => {
    const session = await getServerAuthSession()

    console.log(session)

    return (
        <PrehledClientPage raceId={Number(params.raceId)} userRole={session?.user.role ?? null} />
    )
}

export default PrehledPage