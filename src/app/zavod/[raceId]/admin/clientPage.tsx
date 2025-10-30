"use client"

import React from 'react'
import { api } from '~/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import RegistredTab from './registred'
import PerformanceTab from './performance'
import BackupTab from './backup'
import { notFound } from 'next/navigation'
import EventManagerTab from './managers'

enum UserRole {
  Admin = 3,
  RaceManager = 2,
  EventManager = 1,
  Racer = 0
}

function PrehledClientPage({ raceId, userRole }: { raceId: number, userRole: UserRole | null }) {
    const {data, isSuccess, isLoading, error} = api.race.readRaceById.useQuery({
        id: raceId
    })

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        if (!data) {
            notFound()
        }

        return (
            <Tabs defaultValue="performance">
                <TabsList>
                    {(userRole ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="overview">Přehled</TabsTrigger> : null}
                    {(userRole ?? 0) >= UserRole.EventManager ? <TabsTrigger value="registred">Registrovaní soutěžící</TabsTrigger> : null}
                    {(userRole ?? 0) >= UserRole.EventManager ? <TabsTrigger value="performance">Výkony</TabsTrigger> : null}
                    {(userRole ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="eventManagers">Zapisovači</TabsTrigger> : null}
                    {(userRole ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="backup">Záloha</TabsTrigger> : null}
                </TabsList>
                {(userRole ?? 0) >= UserRole.RaceManager ? <TabsContent value="overview">
                    <OverviewTab race={data} />
                </TabsContent> : null}
                {(userRole ?? 0) >= UserRole.EventManager ? <TabsContent value="registred">
                    <RegistredTab race={data} isRaceManagerOrAbove={(userRole ?? 0) >= UserRole.RaceManager} />
                </TabsContent> : null}
                {(userRole ?? 0) >= UserRole.EventManager ? <TabsContent value="performance">
                    <PerformanceTab race={data} raceId={raceId} isRaceManagerOrAbove={(userRole ?? 0) >= UserRole.RaceManager} />
                </TabsContent> : null}
                {(userRole ?? 0) >= UserRole.RaceManager ? <TabsContent value="eventManagers">
                    <EventManagerTab raceId={raceId}/>
                </TabsContent> : null}
                {(userRole ?? 0) >= UserRole.RaceManager ? <TabsContent value="backup">
                    <BackupTab raceId={raceId}/>
                </TabsContent> : null}
            </Tabs>
        )
    }
}

export default PrehledClientPage