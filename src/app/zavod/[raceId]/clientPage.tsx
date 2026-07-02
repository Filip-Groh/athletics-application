"use client"

import { notFound } from 'next/navigation'
import React from 'react'
import { api } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import ScoreTab from './score'
import QueryWrapper from '~/components/wrappers/QueryWrapper'

type RaceOverviewClientPageProps = {
    raceId: number,
    isSession: boolean
}

const RaceOverviewClientPage: React.FC<RaceOverviewClientPageProps> = ({ raceId, isSession }) => {
    const queries = api.useQueries((t) => [
        t.race.getRaceByIdPublic({ id: raceId }),
        t.racer.getStartingNumber({ raceId }, { enabled: isSession })
    ])

    return (
        <QueryWrapper
            queries={queries}
            emptyPredicate={([race]) => !race}
            Empty={() => notFound()}
            Success={([race, racer]) => (
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Přehled</TabsTrigger>
                        <TabsTrigger value="score">Výkony</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <OverviewTab race={race!} />
                    </TabsContent>
                    <TabsContent value="score">
                        <ScoreTab race={race!} racer={racer} />
                    </TabsContent>
                </Tabs>
            )}
        />
    )
}

export default RaceOverviewClientPage