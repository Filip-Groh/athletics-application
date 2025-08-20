import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import RegistredTab from './registred'
import PerformanceTab from './performance'
import BackupTab from './backup'
import { notFound } from 'next/navigation'
import { api } from '~/trpc/server'
import { getServerAuthSession, UserRole } from '~/server/auth'
import EventManagerTab from './managers'

async function PrehledPage({ params }: { params: { raceId: string } }) {
    const session = await getServerAuthSession()
    const race = await api.race.readRaceById({
        id: Number(params.raceId)
    })

    if (!race) {
        notFound()
    }

    return (
        <Tabs defaultValue="performance">
            <TabsList>
                {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="overview">Přehled</TabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.EventManager ? <TabsTrigger value="registred">Registrovaní soutěžící</TabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.EventManager ? <TabsTrigger value="performance">Výkony</TabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="eventManagers">Zapisovači</TabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsTrigger value="backup">Záloha</TabsTrigger> : null}
            </TabsList>
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsContent value="overview">
                <OverviewTab race={race} />
            </TabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.EventManager ? <TabsContent value="registred">
                <RegistredTab race={race} />
            </TabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.EventManager ? <TabsContent value="performance">
                <PerformanceTab race={race} raceId={race.id} />
            </TabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsContent value="eventManagers">
                <EventManagerTab raceId={race.id}/>
            </TabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <TabsContent value="backup">
                <BackupTab raceId={race.id}/>
            </TabsContent> : null}
        </Tabs>
    )
}

export default PrehledPage