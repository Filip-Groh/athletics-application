"use client"

import React from 'react'
import CoeficientsTable from '~/components/tables/coeficientsTable'
import { api } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Separator } from '~/components/ui/separator'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { createDataset } from '~/lib/utils'

const Coeficients = () => {
    const getEventsWithAgeCoeficientsQuery = api.event.getEventsWithAgeCoeficients.useQuery()

    return (
        <QueryWrapper
            query={getEventsWithAgeCoeficientsQuery}
            transform={(data) => createDataset(data)}
            emptyPredicate={({ eventCategories }) => eventCategories.length === 0}
            Empty={<div>Prvně vytvořte nějaké disciplíny, až pak můžete přiřadit koeficienty.</div>}
            Success={({ dataset, eventCategories, eventCategoriesToSubEventNameMap }) => (
                <Tabs defaultValue={eventCategories[0]} className="w-full">
                    <TabsList>
                        {eventCategories.filter((eventCategory) => eventCategory.charAt(eventCategory.length - 6) != "-").map((eventCategory) => {
                            return <TabsTrigger key={`trigger_${eventCategory}`} value={eventCategory}>{eventCategory}</TabsTrigger>
                        })}
                        <Separator orientation="vertical" className='bg-muted-foreground h-3/6' />
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
            )}
        />
    )
}

export default Coeficients