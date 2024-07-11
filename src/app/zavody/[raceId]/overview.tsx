import React from 'react'
import { type RacePreview } from '~/server/types/race'

function OverviewTab({race}: {race: RacePreview}) {
    return (
        <div>
            <p>Jméno závodu: {race.name}</p>
            <p>Datum konání: {race.date.toLocaleDateString()}</p>
            <p>Organizátor: {race.organizer}</p>
        </div>
    )
}

export default OverviewTab