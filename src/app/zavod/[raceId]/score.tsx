import React from 'react'
import ScoreTable from '~/components/tables/scoreTable'
import { type RouterOutputs } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { formatSex } from '~/lib/utils'

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
    measurements: number[]
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
    return a * (measurement * coeficient - b) ** c
}

function getAge(birthDate: Date) {
    return Math.floor((Date.now() - birthDate.valueOf()) / 1000 / 60 / 60 / 24 / 365.25)
}

function ScoreTab({race}: {race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>}) {
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
                    points: countPoints(bestMeasurement, coeficient, a, b, c)
                }
            }).sort((a, b) => {
                return b.points - a.points
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

    return (
        <Tabs defaultValue={`event_${race.event[0]?.id}`}>
            <TabsList>
                {events.map((event) => event.subEvents.map((subEvent) => {
                    return (
                        <TabsTrigger key={`trigger_event_${subEvent.id}`} value={`event_${subEvent.id}`}>{event.name ? `${event.name} - ` : ""}{subEvent.name} - {formatSex(event.category, true)}</TabsTrigger>
                    )
                }))}
            </TabsList>
            {events.map((event) => event.subEvents.map((subEvent) => {
                return (
                    <TabsContent key={`content_event_${subEvent.id}`} value={`event_${subEvent.id}`}>
                        <ScoreTable data={subEvent.data}/>
                    </TabsContent>
                )
            }))}
        </Tabs>
    )
}

export default ScoreTab