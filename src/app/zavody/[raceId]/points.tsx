import React from 'react'
import PointsTable from '~/components/tables/pointsTable'
import { type RouterOutputs } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export type Data = {
    age: number,
    [eventName: string]: number
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type Dataset = {
    [category: string]: Data[]
}

function PointsTab({events}: {events: NonNullable<RouterOutputs["race"]["readRaceById"]>["event"]}) {
    const dataset: Dataset = {}

    const categories = Array.from(new Set(events.map((event) => {
        return event.category
    })))
    
    const categoriesToAgeMap = new Map<string, number[]>()
    const categoriesToEventNameMap = new Map<string, {id: number, name: string}[]>()
    events.forEach((event) => {
        const currentAges = categoriesToAgeMap.get(event.category)
        const currentEventNames = categoriesToEventNameMap.get(event.category)
        const ages = event.ageCoeficient.map((ageCoeficient) => {
            return ageCoeficient.age
        })
        if (currentAges) {
            ages.forEach((age) => {
                const include = currentAges.some((currentAge) => {
                    return age === currentAge
                })
                if (!include) {
                    currentAges.push(age)
                }
            })
            categoriesToAgeMap.set(event.category, currentAges)
        } else {
            categoriesToAgeMap.set(event.category, ages)
        }

        if (currentEventNames) {
            const include = currentEventNames.some((currentEventName) => {
                return event.id === currentEventName.id
            })
            if (!include) {
                currentEventNames.push({
                    id: event.id,
                    name: event.name
                })
            }
            categoriesToEventNameMap.set(event.category, currentEventNames)
        } else {
            categoriesToEventNameMap.set(event.category, [{
                id: event.id,
                name: event.name
            }])
        }
    }) 

    categories.forEach((category) => {
        const ages = categoriesToAgeMap.get(category)
        const eventNames = categoriesToEventNameMap.get(category)
        if (ages) {
            dataset[category] = ages.map((age) => {
                const returnData: Data = {
                    age: age
                }
                if (!eventNames) {
                    return returnData
                }

                eventNames.forEach((eventName) => {
                    eventsLoop: for (const event of events) {
                        if (event.category !== category || event.id !== eventName.id) {
                            continue
                        }

                        for (const ageCoeficient of event.ageCoeficient) {
                            if (ageCoeficient.age !== age) {
                                continue
                            }

                            returnData[eventName.name] = ageCoeficient.coeficient
                            break eventsLoop
                        }
                    }
                })
                return returnData
            })
        } else {
            dataset[category] = []
        }
    })

    return (
        <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList>
                {categories.map((category) => {
                    return <TabsTrigger key={`trigger_${category}`} value={category}>{category}</TabsTrigger>
                })}
            </TabsList>
            {categories.map((category) => {
                const eventNamesAdept = categoriesToEventNameMap.get(category)
                const eventNames = eventNamesAdept ? eventNamesAdept : []

                const dataAdept = dataset[category]
                const data = dataAdept ? dataAdept : []
                return (
                    <TabsContent key={`content_${category}`} value={category}>
                        <PointsTable eventNames={eventNames} defaultData={data}/>
                    </TabsContent>
                )
            })}
        </Tabs>
    )
}

export default PointsTab