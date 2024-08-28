"use client"

import React from 'react'
import EventForm from '~/components/forms/eventForm'
import NewEventForm from '~/components/forms/newEventForm'
import { useArrayWithIdState } from '~/components/hooks/useArrayWithIdState'
import PerformanceTable from '~/components/tables/performanceTable'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import { formatSex } from '~/lib/utils'
import type { RouterOutputs } from '~/trpc/react'

export type MeasurementType = {
    id: number | undefined
    value: number
}

export type PerformanceType = {
    id: number,
    orderNumber: number,
    startingNumber: number,
    name: string,
    surname: string,
    sex: string,
    birthDate: string,
    measurement: MeasurementType[],
    options: {
        racerId: number,
        eventId: number
    }
}

function PerformanceTab({race}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>}) {
    const {state: events, push: pushEvents} = useArrayWithIdState(race.event, true)

    return (
        <div>
            <VerticalTabs defaultValue={events[0] ? events[0].id.toString() : "event_new"}>
                <VerticalTabsList>
                    {events.map((event) => {
                        return (
                            <VerticalTabsTrigger key={`eventTrigger_${event.id}`} value={event.id.toString()}>{event.name} - {formatSex(event.category, true)}</VerticalTabsTrigger>
                        )
                    })}
                    <VerticalTabsTrigger key="eventTrigger_new" value="event_new">Přidat disciplínu</VerticalTabsTrigger>
                </VerticalTabsList>
                {events.map((event) => {
                    const tableData: PerformanceType[] = event.performance.map<PerformanceType>((value) => {
                        return {
                            id: value.id,
                            orderNumber: value.racer.orderNumber,
                            startingNumber: value.racer.startingNumber,
                            name: value.racer.name,
                            surname: value.racer.surname,
                            sex: value.racer.sex,
                            birthDate: value.racer.birthDate.toLocaleDateString(),
                            measurement: value.measurement.map((measurement) => {
                                return {
                                    id: measurement.id,
                                    value: measurement.value ? measurement.value : NaN
                                }
                            }),
                            options: {
                                racerId: value.racer.id,
                                eventId: event.id
                            }
                        }
                    })

                    return (
                        <VerticalTabsContent key={`eventContent_${event.id}`} value={event.id.toString()} className='flex flex-col gap-8'>
                            <EventForm event={event} />
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