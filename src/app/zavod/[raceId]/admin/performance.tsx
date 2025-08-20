"use client"

import React from 'react'
import RaceEventManagerForm from '~/components/forms/raceEventManagerForm'
import PerformanceTable from '~/components/tables/performanceTable'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import { formatSex } from '~/lib/utils'
import { api, type RouterOutputs } from '~/trpc/react'

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
        raceId: number,
        racerId: number,
        eventId: number,
        subEventId: number
    }
}

function PerformanceTab({race, raceId}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>, raceId: number}) {
    const {data: allEvents, isSuccess: isSuccessGetEvents, isLoading: isLoadingGetEvents, error: errorGetEvents} = api.event.getEvents.useQuery()
    const {data: raceEvents, isSuccess: isSuccessGetRaceEvents, isLoading: isLoadingGetRaceEvents, error: errorGetRaceEvents} = api.race.getRaceEvents.useQuery({
        id: raceId
    })

    if (errorGetEvents) {
        return <div>Nastala chyba: {errorGetEvents.message}</div>
    }

    if (errorGetRaceEvents) {
        return <div>Nastala chyba: {errorGetRaceEvents.message}</div>
    }

    if (isLoadingGetEvents || isLoadingGetRaceEvents) {
        return <div>Loading ...</div>
    }

    if (isSuccessGetEvents && isSuccessGetRaceEvents) {
        return (
            <div>
                <VerticalTabs defaultValue={race.event[0] ? race.event[0].id.toString() : "event_new"}>
                    <VerticalTabsList>
                        {race.event.map((event) => {
                            return (
                                <>
                                    {event.subEvent.map((subEvent) => {
                                        return (
                                            <VerticalTabsTrigger key={`eventTrigger_${subEvent.id}`} value={subEvent.id.toString()}>{event.name ? `${event.name} - ` : ""}{subEvent.name} - {formatSex(event.category, true)}</VerticalTabsTrigger>
                                        )
                                    })}
                                </>
                            )
                        })}
                        <VerticalTabsTrigger key="eventTrigger_new" value="event_new">Disciplíny</VerticalTabsTrigger>
                    </VerticalTabsList>
                    {race.event.map((event) => {
                        return (
                            <>
                                {event.subEvent.map((subEvent) => {
                                    const tableData: PerformanceType[] = subEvent.performance.map<PerformanceType>((value) => {
                                        return {
                                            id: value.id,
                                            orderNumber: value.orderNumber,
                                            startingNumber: value.racer.startingNumber,
                                            name: value.racer.personalData.name,
                                            surname: value.racer.personalData.surname,
                                            sex: value.racer.personalData.sex,
                                            birthDate: value.racer.personalData.birthDate.toLocaleDateString(),
                                            measurement: value.measurement.map((measurement) => {
                                                return {
                                                    id: measurement.id,
                                                    value: measurement.value ? measurement.value : NaN
                                                }
                                            }),
                                            options: {
                                                raceId: raceId,
                                                racerId: value.racer.id,
                                                eventId: event.id,
                                                subEventId: subEvent.id
                                            }
                                        }
                                    })
                
                                    return (
                                        <VerticalTabsContent key={`eventContent_${subEvent.id}`} value={subEvent.id.toString()} className='flex flex-col gap-8'>
                                            <PerformanceTable data={tableData} />
                                        </VerticalTabsContent>
                                    )
                                })}
                            </>
                        )
                    })}
                    <VerticalTabsContent key="eventContent_new" value="event_new">
                        <RaceEventManagerForm allEvents={allEvents} raceEvents={raceEvents} raceId={raceId}/>
                    </VerticalTabsContent>
                </VerticalTabs>
            </div>
        )
    }
}

export default PerformanceTab