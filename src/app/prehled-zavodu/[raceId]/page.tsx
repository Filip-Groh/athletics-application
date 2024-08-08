import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { api } from '~/trpc/server'
import OverviewTab from './overview'
import ScoreTab from './score'
import { notFound } from 'next/navigation'

async function RaceOverview({ params }: { params: { raceId: string } }) {
    const race = await api.race.getRaceByIdPublic({
        id: Number(params.raceId)
    })

    if (!race) {
        notFound()
    }

    return (
        <Tabs defaultValue="overview">
            <TabsList>
                <TabsTrigger value="overview">Přehled</TabsTrigger>
                <TabsTrigger value="score">Výkony</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <OverviewTab race={race} />
            </TabsContent>
            <TabsContent value="score">
                <ScoreTab race={race} />
            </TabsContent>
        </Tabs>
    )
}

export default RaceOverview