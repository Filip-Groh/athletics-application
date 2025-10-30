import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import AccountAttendRequestClientPage from './clientPage'

async function AccountAttendRequestPage({ params }: { params: { raceId: string } }) {
    const session = await getServerAuthSession()
    const optionalPersonalData = session?.user.personalData
    const personalData = optionalPersonalData ?? null

    if (personalData === null) {
        return (
            <p>Nejdříve musíte vyplnit osobní údaje v profilu. (Vpravo nahoře Profil -&gt; Přehled)</p>
        )
    }

    return (
        <AccountAttendRequestClientPage raceId={Number(params.raceId)} sessionPersonalData={personalData}/>
    )
}

export default AccountAttendRequestPage