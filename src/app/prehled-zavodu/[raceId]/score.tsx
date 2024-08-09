import React from 'react'
import ScoreTable from '~/components/tables/scoreTable'
import { type RouterOutputs } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { formatSex } from '~/lib/utils'

export type ScoreData = {
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
    name: string,
    category: string,
    data: ScoreData[]
}

function countPoints(measurement: number, coeficient: number, a: number, b: number, c: number) {
    return a * (measurement * coeficient - b) ** c
}

function getAge(birthDate: Date) {
    return Math.floor((Date.now() - birthDate.valueOf()) / 1000 / 60 / 60 / 24 / 365.25)
}

function ScoreTab({race}: {race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>}) {
    const events: Events[] = race.event.map((event) => {
        const a = event.a as number
        const b = event.b as number
        const c = event.c as number
        const ageCoeficients = new Map<number, number>()
        event.ageCoeficient.forEach((ageCoeficient) => {
            ageCoeficients.set(ageCoeficient.age, ageCoeficient.coeficient)
        })

        const data: ScoreData[] = event.performance.map((performance) => {
            const measurements = performance.measurement.map((measurement) => {
                return measurement.value ?? 0
            })
            const bestMeasurement = measurements.reduce((prev, curr) => {
                return Math.max(prev, curr)
            }) ?? 0
            const age = getAge(performance.racer.birthDate)
            let coeficient = 1
            for (let i = age; i > 0; i--) {
                const ageCoeficient = ageCoeficients.get(i)
                coeficient = ageCoeficient ?? coeficient
            }
            return {
                name: performance.racer.name,
                surname: performance.racer.surname,
                age: age,
                club: performance.racer.club,
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
            id: event.id,
            name: event.name,
            category: event.category,
            data: data
        }
    })

    return (
        <Tabs defaultValue={`event_${race.event[0]?.id}`}>
            <TabsList>
                {events.map((event) => {
                    return (
                        <TabsTrigger key={`trigger_event_${event.id}`} value={`event_${event.id}`}>{event.name} - {formatSex(event.category, true)}</TabsTrigger>
                    )
                })}
            </TabsList>
            {events.map((event) => {
                return (
                    <TabsContent key={`content_event_${event.id}`} value={`event_${event.id}`}>
                        <ScoreTable data={event.data}/>
                    </TabsContent>
                )
            })}
        </Tabs>
    )
}

export default ScoreTab