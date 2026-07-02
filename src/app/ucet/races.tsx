import React from 'react'
import CreateRaceButton from '~/components/elements/createRaceButton'
import RaceCards from '~/components/elements/raceCards'
import { getServerAuthSession, UserRole } from '~/server/auth'

const Races = async () => {
    const session = await getServerAuthSession()

    if ((session?.user.role ?? 0) >= UserRole.RaceManager) {
        return (
            <div>                 
                <CreateRaceButton />
                <RaceCards />
            </div>
        )
    }

    return (
        <div>
            <RaceCards />
        </div>
    )
}

export default Races