import React from 'react'
import { type RouterOutputs } from '~/trpc/react'

function OverviewTab({race}: {race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>}) {
    return (
        <div>
            <h1>{race.name}</h1>
            <p>Koná se {race.date.toLocaleDateString()} v {race.place}.</p>
            <p>Pořádá {race.organizer}.</p>
            <h2>Disciplíny:</h2>
            <ul>
                {race.event.map((event) => {
                    return (
                        <li key={`event_${event.id}`}>{event.name} - {event.category}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default OverviewTab