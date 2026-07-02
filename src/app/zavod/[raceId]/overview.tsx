import React from 'react'
import { formatSex } from '~/lib/utils'
import { type RouterOutputs } from '~/trpc/react'

type OverviewTabProps = {
    race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>
}

const OverviewTab: React.FC<OverviewTabProps> = ({ race }) => {
    return (
        <div>
            <h1>{race.name}</h1>
            <p>Koná se {race.date.toLocaleDateString()} v {race.date.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })} v {race.place}.</p>
            <p>Pořádá {race.organizer}.</p>
            <h2>Disciplíny:</h2>
            <ul>
                {race.event.map((event) => {
                    return (
                        <li key={`event_${event.id}`}>{event.name ?? event.subEvent[0]?.name} - {formatSex(event.category, true)}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default OverviewTab