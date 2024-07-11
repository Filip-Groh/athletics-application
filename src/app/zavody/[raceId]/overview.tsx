import React from 'react'
import { type Race } from '~/server/types/race'

function OverviewTab({race}: {race: Race}) {
    return (
        <div>
            <p>Jméno závodu: {race.name}</p>
            <p>Datum konání: {race.date.toLocaleDateString()}</p>
            <p>Organizátor: {race.organizer}</p>
        </div>
    )
}

export default OverviewTab