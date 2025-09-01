import React from 'react'
import { VerticalTabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '~/components/ui/verticalTabs'
import { getServerAuthSession, UserRole } from '~/server/auth'
import Overview from './overview'
import Races from './races'
import Roles from './roles'
import Events from './events'
import Coeficients from './coeficients'
import Backup from './backup'

async function ProfilePage() {
    const session = await getServerAuthSession()

    return (
        <VerticalTabs defaultValue='overview'>
            <VerticalTabsList>
                <VerticalTabsTrigger key="overviewTrigger" value="overview">Přehled</VerticalTabsTrigger>
                {(session?.user.role ?? 0) >= UserRole.EventManager ? <VerticalTabsTrigger key="racesTrigger" value="races">Pořádané závody</VerticalTabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.RaceManager ? <VerticalTabsTrigger key="rolesTrigger" value="roles">Správa rolí</VerticalTabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsTrigger key="eventsTrigger" value="events">Disciplíny</VerticalTabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsTrigger key="coeficientsTrigger" value="coeficients">Koeficienty</VerticalTabsTrigger> : null}
                {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsTrigger key="backupTrigger" value="backup">Backup</VerticalTabsTrigger> : null}
            </VerticalTabsList>
            <VerticalTabsContent key="overviewContent" value="overview">
                <Overview />
            </VerticalTabsContent>
            {(session?.user.role ?? 0) >= UserRole.EventManager ? <VerticalTabsContent key="racesContent" value="races">
                <Races />
            </VerticalTabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <VerticalTabsContent key="rolesContent" value="roles">
                <Roles />
            </VerticalTabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsContent key="eventsContent" value="events">
                <Events />
            </VerticalTabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsContent key="coeficientsContent" value="coeficients">
                <Coeficients />
            </VerticalTabsContent> : null}
            {(session?.user.role ?? 0) >= UserRole.Admin ? <VerticalTabsContent key="backupContent" value="backup">
                <Backup />
            </VerticalTabsContent> : null}
        </VerticalTabs>
    )
}

export default ProfilePage