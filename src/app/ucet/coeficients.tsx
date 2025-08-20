"use client"

import React from 'react'
import CoeficientsTable from '~/components/tables/coeficientsTable'
import { api, type RouterOutputs } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { formatSex } from '~/lib/utils'
import { Separator } from '~/components/ui/separator'

export type Data = {
    age: number,
    [subEventName: string]: number
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type Dataset = {
    [eventName: string]: Data[]
}

function getEventCategories(event: NonNullable<RouterOutputs["event"]["getEventsWithAgeCoeficients"]>[0]) {
    if (event.name) {
        return `${event.name} - ${formatSex(event.category, true)}`
    }
    return formatSex(event.category, true)
}

function Coeficients() {
    const {data: events, isSuccess, isLoading, error} = api.event.getEventsWithAgeCoeficients.useQuery()

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        const dataset: Dataset = {}

        const eventCategories = Array.from(new Set(events.map((event) => {
            return getEventCategories(event)
        })))
        
        const eventCategoriesToAgeMap = new Map<string, number[]>()
        const eventCategoriesToSubEventNameMap = new Map<string, {id: number, name: string}[]>()
        events.forEach((event) => {
            event.subEvent.forEach((subEvent) => {
                const currentAges = eventCategoriesToAgeMap.get(getEventCategories(event))
                const currentSubEventNames = eventCategoriesToSubEventNameMap.get(getEventCategories(event))
                const ages = subEvent.ageCoeficient.map((ageCoeficient) => {
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
                    eventCategoriesToAgeMap.set(getEventCategories(event), currentAges)
                } else {
                    eventCategoriesToAgeMap.set(getEventCategories(event), ages)
                }

                if (currentSubEventNames) {
                    const include = currentSubEventNames.some((currentSubEventName) => {
                        return subEvent.id === currentSubEventName.id
                    })
                    if (!include) {
                        currentSubEventNames.push({
                            id: subEvent.id,
                            name: subEvent.name
                        })
                    }
                    eventCategoriesToSubEventNameMap.set(getEventCategories(event), currentSubEventNames)
                } else {
                    eventCategoriesToSubEventNameMap.set(getEventCategories(event), [{
                        id: subEvent.id,
                        name: subEvent.name
                    }])
                }
            })
        }) 
    
        eventCategories.forEach((eventCategory) => {
            const ages = eventCategoriesToAgeMap.get(eventCategory)
            const subEventNames = eventCategoriesToSubEventNameMap.get(eventCategory)

            if (ages) {
                dataset[eventCategory] = ages.map((age) => {
                    const returnData: Data = {
                        age: age
                    }
                    if (!subEventNames) {
                        return returnData
                    }
    
                    subEventNames.forEach((subEventName) => {
                        for (const event of events) {
                            subEventsLoop: for (const subEvent of event.subEvent) {
                                if (getEventCategories(event) !== eventCategory || subEvent.id !== subEventName.id) {
                                    continue
                                }
        
                                for (const ageCoeficient of subEvent.ageCoeficient) {
                                    if (ageCoeficient.age !== age) {
                                        continue
                                    }
        
                                    returnData[subEventName.name] = ageCoeficient.coeficient
                                    break subEventsLoop
                                }
                            }
                        }
                    })
                    return returnData
                })
            } else {
                dataset[eventCategory] = []
            }
        })

        if (eventCategories.length === 0) {
            return <div>Prvně vytvořte nějaké disciplíny, až pak můžete přiřadit koeficienty.</div>
        }
    
        return (
            <Tabs defaultValue={eventCategories[0]} className="w-full">
                <TabsList>
                    {eventCategories.filter((eventCategory) => eventCategory.charAt(eventCategory.length - 6) != "-").map((eventCategory) => {
                        return <TabsTrigger key={`trigger_${eventCategory}`} value={eventCategory}>{eventCategory}</TabsTrigger>
                    })}
                    <Separator orientation="vertical" className='bg-muted-foreground h-3/6'/>
                    {eventCategories.filter((eventCategory) => eventCategory.charAt(eventCategory.length - 6) == "-").map((eventCategory) => {
                        return <TabsTrigger key={`trigger_${eventCategory}`} value={eventCategory}>{eventCategory}</TabsTrigger>
                    })}
                </TabsList>
                {eventCategories.map((eventCategory) => {
                    const subEventNamesAdept = eventCategoriesToSubEventNameMap.get(eventCategory)
                    const subEventNames = subEventNamesAdept ? subEventNamesAdept : []
    
                    const dataAdept = dataset[eventCategory]
                    const data = dataAdept ? dataAdept : []
                    return (
                        <TabsContent key={`content_${eventCategory}`} value={eventCategory}>
                            <CoeficientsTable subEventNames={subEventNames} defaultData={data} />
                        </TabsContent>
                    )
                })}
            </Tabs>
        )
    }
}

export default Coeficients