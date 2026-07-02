import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import AccountAttendRequestClientPage from './clientPage'

type AccountAttendRequestPageProps = {
    params: {
        raceId: string
    }
}

const AccountAttendRequestPage: React.FC<AccountAttendRequestPageProps> = async ({ params }) => {
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