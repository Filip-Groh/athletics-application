"use client"

import React from 'react'
import NewEventForm from '~/components/forms/newEventForm'
import { useArrayWithIdState } from '~/components/hooks/useArrayWithIdState'
import PerformanceTable from '~/components/tables/performanceTable'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import type { RouterOutputs } from '~/trpc/react'

export type MeasurementType = {
    id: number | undefined
    value: number
}

export type PerformanceType = {
    id: number,
    name: string,
    surname: string,
    sex: string,
    birthDate: string,
    measurement: MeasurementType[]
}

function PerformanceTab({race}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>}) {
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
                    const tableData: PerformanceType[] = event.performance.map<PerformanceType>((value) => {
                        return {
                            id: value.id,
                            name: value.racer.name,
                            surname: value.racer.surname,
                            sex: value.racer.sex,
                            birthDate: value.racer.birthDate.toLocaleDateString(),
                            measurement: value.measurement.map((measurement) => {
                                return {
                                    id: measurement.id,
                                    value: measurement.value ? measurement.value : NaN
                                }
                            })
                        }
                    })

                    return (
                        <VerticalTabsContent key={`eventContent_${event.id}`} value={event.id.toString()}>
                            <PerformanceTable data={tableData} />
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