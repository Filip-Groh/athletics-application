"use client"

import React from 'react'
import ScoreTable from '~/components/tables/scoreTable'
import { type RouterOutputs } from '~/trpc/react'
import { formatSex } from '~/lib/utils'
import TreeTabs, { type DropdownNode, type SingleNode } from '~/components/elements/treeTabs'
import GroupScoreTable from '~/components/tables/groupScoreTable'

export type ScoreData = {
    startingNumber: number,
    orderNumber: number,
    name: string,
    surname: string,
    age: number,
    club: string,
    position: number,
    points: number,
    bestMeasurement: number,
    measurements: number[],
    isMe: boolean
}

export type GroupScoreData = {
    startingNumber: number,
    name: string,
    surname: string,
    age: number,
    club: string,
    position: number,
    points: number,
    subEventPoints: (number | null)[],
    isMe: boolean
}

type Events = {
    id: number,
    name: string | null,
    category: string,
    subEvents: {
        id: number,
        name: string,
        data: ScoreData[]
    }[]
}

function countPoints(measurement: number, coeficient: number, a: number, b: number, c: number) {
    const points = a * ((measurement * coeficient - b) ** c)
    return Math.floor(points)
}

function getAge(birthDate: Date) {
    return Math.floor((Date.now() - birthDate.valueOf()) / 1000 / 60 / 60 / 24 / 365.25)
}

function ScoreTab({race, racer}: {race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>, racer: RouterOutputs["racer"]["getStartingNumber"] | null}) {
    const events: Events[] = race.event.map((event) => {
        const subEvents = event.subEvent.map((subEvent) => {
            const a = subEvent.a
            const b = subEvent.b
            const c = subEvent.c
            const ageCoeficients = new Map<number, number>()
            subEvent.ageCoeficient.forEach((ageCoeficient) => {
                ageCoeficients.set(ageCoeficient.age, ageCoeficient.coeficient)
            })

            const data: ScoreData[] = subEvent.performance.map((performance) => {
                const measurements = performance.measurement.map((measurement) => {
                    return measurement.value ?? 0
                })
                const bestMeasurement = measurements.reduce((prev, curr) => {
                    return Math.max(prev, curr)
                }, 0)
                const age = getAge(performance.racer.personalData.birthDate)
                let coeficient = 1
                for (let i = age; i > 0; i--) {
                    const ageCoeficient = ageCoeficients.get(i)
                    coeficient = ageCoeficient ?? coeficient
                    if (ageCoeficient !== undefined) {
                        break
                    }
                }
                return {
                    startingNumber: performance.racer.startingNumber,
                    orderNumber: performance.orderNumber,
                    name: performance.racer.personalData.name,
                    surname: performance.racer.personalData.surname,
                    age: age,
                    club: performance.racer.personalData.club,
                    measurements: measurements,
                    bestMeasurement: bestMeasurement,
                    points: countPoints(bestMeasurement, coeficient, a, b, c),
                    isMe: racer?.startingNumber === performance.racer.startingNumber
                }
            }).sort((a, b) => {
                return (Number.isNaN(b.points) ? -1 : b.points) - (Number.isNaN(a.points) ? -1 : a.points)
            }).map((racer, index) => {
                return {
                    position: index,
                    ...racer
                }
            })

            return {
                id: subEvent.id,
                name: subEvent.name,
                data
            }
        })

        return {
            id: event.id,
            name: event.name,
            category: event.category,
            subEvents
        }
    })

    const tree = events.flatMap<SingleNode | DropdownNode>((event) => {
        if (event.name) {
            const startingNumberPoints = new Map<number, Omit<GroupScoreData, 'position'>>()
            event.subEvents.forEach((subEvent) => {
                subEvent.data.forEach((scoreData) => {
                    const groupScoreData = startingNumberPoints.get(scoreData.startingNumber) ?? {
                        startingNumber: scoreData.startingNumber,
                        name: scoreData.name,
                        surname: scoreData.surname,
                        age: scoreData.age,
                        club: scoreData.club,
                        points: 0,
                        subEventPoints: [],
                        isMe: scoreData.isMe
                    }
                    groupScoreData.subEventPoints.push(scoreData.measurements.length !== 0 ? (Number.isNaN(scoreData.points) ? 0 : scoreData.points) : null)
                    groupScoreData.points += Number.isNaN(scoreData.points) ? 0 : scoreData.points
                    startingNumberPoints.set(scoreData.startingNumber, groupScoreData)
                })
            })

            const groupScoreData: GroupScoreData[] = Array.from(startingNumberPoints.values()).sort((a, b) => {
                return (Number.isNaN(b.points) ? -1 : b.points) - (Number.isNaN(a.points) ? -1 : a.points)
            }).map((racer, index) => {
                return {
                    position: index,
                    ...racer
                }
            })

            return [{
                isDropdown: true,
                triggerText: `${event.name} - ${formatSex(event.category, true)}`,
                uniqueId: `event_${event.id}`,
                content: (
                    <GroupScoreTable data={groupScoreData} />
                ),
                dropdownNodes: event.subEvents.map((subEvent) => {
                    return {
                        isDropdown: false,
                        triggerText: `${subEvent.name} - ${formatSex(event.category, true)}`,
                        uniqueId: `event_${event.id}:subEvent_${subEvent.id}`,
                        content: (
                            <ScoreTable data={subEvent.data}/>
                        )
                    }
                })
            }]
        } else {
            return event.subEvents.map((subEvent) => {
                return {
                    isDropdown: false,
                    triggerText: `${subEvent.name} - ${formatSex(event.category, true)}`,
                    uniqueId: `event_${subEvent.id}`,
                    content: (
                        <ScoreTable data={subEvent.data}/>
                    )
                }
            })
        }
    })

    return (
        <TreeTabs tree={tree} />
    )
}

export default ScoreTab