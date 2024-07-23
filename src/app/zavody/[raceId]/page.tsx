import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import RegistredTab from './registred'
import PerformanceTab from './performance'
import PointsTab from './points'
import BackupTab from './backup'
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server'

async function PrehledPage({ params }: { params: { raceId: string } }) {
    const race = await api.race.readRaceById({
        id: Number(params.raceId)
    })

    if (!race) {
        notFound()
    }

    return (
        <Tabs defaultValue="overview">
            <TabsList>
                <TabsTrigger value="overview">Přehled</TabsTrigger>
                <TabsTrigger value="registred">Registrovaní soutěžící</TabsTrigger>
                <TabsTrigger value="performance">Výkony</TabsTrigger>
                <TabsTrigger value="points">Bodování</TabsTrigger>
                <TabsTrigger value="backup">Záloha</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <OverviewTab race={race} />
            </TabsContent>
            <TabsContent value="registred">
                <RegistredTab race={race} />
            </TabsContent>
            <TabsContent value="performance">
                <PerformanceTab race={race} />
            </TabsContent>
            <TabsContent value="points">
                <PointsTab />
            </TabsContent>
            <TabsContent value="backup">
                <BackupTab />
            </TabsContent>
        </Tabs>
    )
}

export default PrehledPage