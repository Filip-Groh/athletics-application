"use client"

import React from 'react'
import TodaysRaceCards from '~/components/elements/todaysRaceCards'
import UpcomingRaceCards from '~/components/elements/upcomingRaceCards'
import { api } from '~/trpc/react'

function HomeClientPage({isSession, hasPersonalData}: {isSession: boolean, hasPersonalData: boolean}) {
    if (isSession) {
        const {data, isSuccess, isLoading, error} = api.race.getSignUpRaces.useQuery()
    
        if (error) {
            return <div>Nastala chyba: {error.message}</div>
        }
    
        if (isLoading) {
            return <div>Loading ...</div>
        }
    
        if (isSuccess) {
            return (
                <div>
                    <h2>Dnešní závody</h2>
                    <TodaysRaceCards signupRaces={data} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
                    <h2>Nadcházející závody</h2>
                    <UpcomingRaceCards signupRaces={data} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
                </div>
            )
        }
    }

    return (
        <div>
            <h2>Dnešní závody</h2>
            <TodaysRaceCards signupRaces={[]} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
            <h2>Nadcházející závody</h2>
            <UpcomingRaceCards signupRaces={[]} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
        </div>
    )
}

export default HomeClientPage