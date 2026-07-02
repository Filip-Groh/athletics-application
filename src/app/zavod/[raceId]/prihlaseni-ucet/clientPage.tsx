"use client"

import { type PersonalData } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import AccontForm from '~/components/forms/attendance/accontForm'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { api } from '~/trpc/react'

type AccountAttendRequestClientPageProps = {
    raceId: number,
    sessionPersonalData: PersonalData | null
}

const AccountAttendRequestClientPage: React.FC<AccountAttendRequestClientPageProps> = ({ raceId, sessionPersonalData }) => {
    const queries = api.useQueries((t) => [
        t.race.getSignUpRaces(),
        t.race.getRaceEvents({id: raceId})
    ])

    return (
        <QueryWrapper
            queries={queries}
            emptyPredicate={([, raceEvents]) => !raceEvents}
            Empty={() => notFound()}
            Success={([signUpRaces, raceEvents]) => {
                if (signUpRaces.some(signupRace => signupRace.id === raceId)) {
                    redirect(`/zavod/${raceId}`)
                }

                return (
                    <AccontForm sessionPersonalData={sessionPersonalData} raceId={raceId} events={raceEvents}/>
                )
            }}
        />
    )
}

export default AccountAttendRequestClientPage