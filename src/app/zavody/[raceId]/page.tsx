import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import OverviewTab from './overview'
import RegistredTab from './registred'
import PerformanceTab from './performance'
import PointsTab from './points'
import BackupTab from './backup'

function PrehledPage() {
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
                <OverviewTab />
            </TabsContent>
            <TabsContent value="registred">
                <RegistredTab />
            </TabsContent>
            <TabsContent value="performance">
                <PerformanceTab />
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