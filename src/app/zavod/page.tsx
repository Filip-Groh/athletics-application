import React from 'react'
import AssignedRaceCards from '~/components/elements/assignedRaceCards';
import OwnedRaceCards from '~/components/elements/ownedRaceCards';
import { getServerAuthSession, UserRole } from '~/server/auth';  

async function ZavodyPage() {
    const session = await getServerAuthSession()

    return (
        <>
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <>
                <p>Mnou pořádané závody:</p>
                <OwnedRaceCards />
            </> : null}
            <p>Závody kde jsem zapisovatel:</p>
            <AssignedRaceCards />
        </>
    )
}

export default ZavodyPage