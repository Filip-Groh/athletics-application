import { notFound } from 'next/navigation'
import React from 'react'
import AccontForm from '~/components/forms/attendance/accontForm'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

async function AccountAttendRequestPage({ params }: { params: { raceId: string } }) {
    const session = await getServerAuthSession()
    const optionalPersonalData = session?.user.personalData
    const personalData = optionalPersonalData ?? null

    const events = await api.race.getRaceEvents({
        id: Number(params.raceId)
    })

    if (!events) {
        notFound()
    }

    if (personalData === null) {
        return (
            <p>Nejdříve musíte vyplnit osobní údaje v profilu. (Vpravo nahoře Profil -&gt; Přehled)</p>
        )
    }

    return (
        <AccontForm sessionPersonalData={personalData} raceId={Number(params.raceId)} events={events}/>
    )
}

export default AccountAttendRequestPage