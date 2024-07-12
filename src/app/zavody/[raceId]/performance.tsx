"use client"

import React from 'react'
import NewEventForm from '~/components/forms/newEventForm'
import { useArrayWithIdState } from '~/components/hooks/useArrayWithIdState'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import type { Race } from '~/server/types/race'

function PerformanceTab({race}: {race: Race}) {
    const {state: events, push: pushEvents} = useArrayWithIdState(race.event, true)

    return (
        <div>
            <VerticalTabs defaultValue={events[0] ? events[0].id.toString() : "event_new"}>
                <VerticalTabsList>
                    {events.map((event) => {
                        return (
                            <VerticalTabsTrigger key={`eventTrigger_${event.id}`} value={event.id.toString()}>{event.name}</VerticalTabsTrigger>
                        )
                    })}
                    <VerticalTabsTrigger key="eventTrigger_new" value="event_new">Přidat disciplínu</VerticalTabsTrigger>
                </VerticalTabsList>
                {events.map((event) => {
                    return (
                        <VerticalTabsContent key={`eventContent_${event.id}`} value={event.id.toString()}>
                            {event.performance.map((performance) => {
                                return (
                                    <p key={performance.id}>{performance.racer.id}</p>
                                )
                            })}
                        </VerticalTabsContent>
                    )
                })}
                <VerticalTabsContent key="eventContent_new" value="event_new">
                    <NewEventForm race={race} pushEvents={pushEvents} />
                </VerticalTabsContent>
            </VerticalTabs>
        </div>
    )
}

export default PerformanceTab