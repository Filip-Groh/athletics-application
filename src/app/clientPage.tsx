"use client"

import { Calendar, Clock } from 'lucide-react'
import React from 'react'
import TodaysRaceCards from '~/components/elements/todaysRaceCards'
import UpcomingRaceCards from '~/components/elements/upcomingRaceCards'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { api } from '~/trpc/react'

type HomeClientPageProps = {
    isSession: boolean,
    hasPersonalData: boolean
}

const HomeClientPage: React.FC<HomeClientPageProps> = ({ isSession, hasPersonalData }) => {
    const getSignUpRacesQuery = api.race.getSignUpRaces.useQuery(undefined, {
        enabled: isSession
    })

    return (
        <QueryWrapper
            query={getSignUpRacesQuery}
            successPredicate={(data) => data.isSuccess || (data.isPending && !data.isFetching)}
            Success={(data) => (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock />
                        <span>Dnešní závody</span>
                    </h2>
                    <TodaysRaceCards signupRaces={data ?? []} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8 flex items-center gap-2">
                        <Calendar />
                        <span>Nadcházející závody</span>
                    </h2>
                    <UpcomingRaceCards signupRaces={data ?? []} isLoggedIn={isSession} hasPersonalData={hasPersonalData} />
                </div>
            )}
        />
    )
}

export default HomeClientPage