"use client"

import { ChevronsUpDown } from 'lucide-react'
import React from 'react'
import TreeTabs, { type DropdownNode, type SingleNode } from '~/components/elements/treeTabs'
import RaceEventManagerForm from '~/components/forms/raceEventManagerForm'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import PerformanceTable from '~/components/tables/performanceTable'
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

const constructPerformanceTableTree = (race: NonNullable<RouterOutputs["race"]["readRaceById"]>, raceId: number, raceEvents: NonNullable<RouterOutputs["race"]["getRaceEvents"]>, allEvents: RouterOutputs["event"]["getEvents"], isRaceManagerOrAbove: boolean) => {
    const tree = race.event.flatMap<SingleNode | DropdownNode>((event) => {
        if (event.name) {
            const node: DropdownNode = {
                isDropdown: true,
                triggerText: `${event.name} - ${formatSex(event.category, true)}`,
                uniqueId: `event_${event.id}`,
                content: (
                    <div className="flex items-center gap-2">
                        Pouze seskupení, musíte rozkliknout
                        <ChevronsUpDown className="h-4 w-4" />
                    </div>
                ),
                dropdownNodes: event.subEvent.map((subEvent) => {
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

                    const node: SingleNode = {
                        isDropdown: false,
                        triggerText: `${subEvent.name} - ${formatSex(event.category, true)}`,
                        uniqueId: `event_${event.id}:subEvent_${subEvent.id}`,
                        content: (
                            <PerformanceTable performance={tableData} isRaceManagerOrAbove={isRaceManagerOrAbove} />
                        )
                    }

                    return node
                })
            }

            return [node]
        } else {
            return event.subEvent.map((subEvent) => {
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

                const node: SingleNode = {
                    isDropdown: false,
                    triggerText: `${subEvent.name} - ${formatSex(event.category, true)}`,
                    uniqueId: `event_${event.id}:subEvent_${subEvent.id}`,
                    content: (
                        <PerformanceTable performance={tableData} isRaceManagerOrAbove={isRaceManagerOrAbove} />
                    )
                }

                return node
            })
        }
    })

    if (isRaceManagerOrAbove) {
        tree.push({
            isDropdown: false,
            triggerText: "Disciplíny",
            uniqueId: "event_new",
            content: (
                <RaceEventManagerForm allEvents={allEvents} raceEvents={raceEvents} raceId={raceId} />
            )
        })
    }

    return tree
}

type PerformanceTabProps = {
    race: NonNullable<RouterOutputs["race"]["readRaceById"]>,
    raceId: number,
    isRaceManagerOrAbove: boolean
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ race, raceId, isRaceManagerOrAbove }) => {
    const queries = api.useQueries((t) => [
        t.event.getEvents(),
        t.race.getRaceEvents({ id: raceId })
    ])

    return (
        <QueryWrapper
            queries={queries}
            transform={([allEvents, raceEvents]) => constructPerformanceTableTree(race, raceId, raceEvents, allEvents, isRaceManagerOrAbove)}
            Success={(tree) => (
                <TreeTabs tree={tree} />
            )}
        />
    )
}

export default PerformanceTab