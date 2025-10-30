"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { api, type RouterOutputs } from '~/trpc/react'
import Link from 'next/link'
import SignupButtonGroup from './signupButtonGroup'

function TodaysRaceCards({signupRaces, isLoggedIn, hasPersonalData}: {signupRaces: RouterOutputs["race"]["getSignUpRaces"], isLoggedIn: boolean, hasPersonalData: boolean}) {
    const {data, isSuccess, isLoading, error} = api.race.getTodayRaces.useQuery()

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        if (data.length === 0) {
            return <div>Dnes se nakonají žádné závody.</div>
        }

        return (
            <>
                {data.map((race) => {
                    return (   
                        <Card key={`race_${race.id}`}>
                            <Link href={`/zavod/${race.id}`}>
                                <CardHeader>
                                    <CardTitle>{race.name}</CardTitle>
                                    <CardDescription>{race.date.toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Organizuje: {race.organizer}</p>
                                    <p>Na místě: {race.place}</p>
                                </CardContent>
                            </Link>
                            <CardFooter>
                                {signupRaces.some(signupRace => signupRace.id === race.id) ? (
                                    <div>Již jste přihlášeni na tento závod.</div>
                                ) : (
                                    <SignupButtonGroup raceId={race.id} isLoggedIn={isLoggedIn} hasPersonalData={hasPersonalData} />
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </>
        )
    }
}

export default TodaysRaceCards