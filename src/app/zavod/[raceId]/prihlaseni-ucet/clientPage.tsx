"use client"

import { type PersonalData } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import AccontForm from '~/components/forms/attendance/accontForm'
import { api } from '~/trpc/react'

function AccountAttendRequestClientPage({raceId, sessionPersonalData}: {raceId: number, sessionPersonalData: PersonalData | null}) {
    const {data: signUpRaces, isSuccess: isSignUpRacesSuccess, isLoading: isSignUpRacesLoading, error: signUpRacesError} = api.race.getSignUpRaces.useQuery()
    const {data: raceEvents, isSuccess: isRaceEventsSuccess, isLoading: isRaceEventsLoading, error: raceEventsError} = api.race.getRaceEvents.useQuery({
        id: raceId
    })

    if (signUpRacesError) {
        return <div>Nastala chyba: {signUpRacesError.message}</div>
    }

    if (raceEventsError) {
        return <div>Nastala chyba: {raceEventsError.message}</div>
    }

    if (isSignUpRacesLoading || isRaceEventsLoading) {
        return <div>Loading ...</div>
    }

    if (isSignUpRacesSuccess && isRaceEventsSuccess) {
        if (signUpRaces.some(signupRace => signupRace.id === raceId)) {
            redirect(`/zavod/${raceId}`)
        }

        if (!raceEvents) {
            notFound()
        }

        return (
            <AccontForm sessionPersonalData={sessionPersonalData} raceId={raceId} events={raceEvents}/>
        )
    }
}

export default AccountAttendRequestClientPage