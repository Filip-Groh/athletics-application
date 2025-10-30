"use client"

import { notFound } from 'next/navigation'
import React from 'react'
import { api, type RouterOutputs } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import ScoreTab from './score'

function RaceOverviewClientPage({raceId, isSession}: {raceId: number, isSession: boolean}) {
    const {data: race, isSuccess, isLoading, error} = api.race.getRaceByIdPublic.useQuery({
        id: raceId
    })

    let racer: RouterOutputs["racer"]["getStartingNumber"] | null = null
    if (isSession) {
        const {data, isSuccess, isLoading, error} = api.racer.getStartingNumber.useQuery({raceId})

        if (error) {
            return <div>Nastala chyba: {error.message}</div>
        }

        if (isLoading) {
            return <div>Loading ...</div>
        }

        if (isSuccess) {
            racer = data
        }
    }

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
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
                    <ScoreTab race={race} racer={racer} />
                </TabsContent>
            </Tabs>
        )
    }
}

export default RaceOverviewClientPage