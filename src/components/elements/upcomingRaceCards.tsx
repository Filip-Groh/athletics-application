"use client"

import React from 'react'
import { api, type RouterOutputs } from '~/trpc/react'
import QueryWrapper from '../wrappers/QueryWrapper'
import RaceCard from './RaceCard'
import { Calendar } from 'lucide-react'

type UpcomingRaceCardsProps = {
    signupRaces: RouterOutputs["race"]["getSignUpRaces"],
    isLoggedIn: boolean,
    hasPersonalData: boolean
}

const UpcomingRaceCards: React.FC<UpcomingRaceCardsProps> = ({ signupRaces, isLoggedIn, hasPersonalData }) => {
    const getUpcomingRacesQuery = api.race.getUpcomingRaces.useQuery()

    return (
        <QueryWrapper
            query={getUpcomingRacesQuery}
            Empty={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Žádné nadcházející závody.</p>
                </div>
            }
            Success={(data) => (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {data.map((race) => (
                        <RaceCard
                            key={`race_${race.id}`}
                            race={race}
                            isSignedUp={signupRaces.some(signupRace => signupRace.id === race.id)}
                            isLoggedIn={isLoggedIn}
                            hasPersonalData={hasPersonalData}
                        />
                    ))}
                </div>
            )}
        />
    )
}

export default UpcomingRaceCards