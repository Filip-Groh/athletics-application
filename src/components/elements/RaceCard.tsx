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
import Link from 'next/link'
import SignupButtonGroup from './signupButtonGroup'

type Race = {
    id: number
    name: string
    date: Date | string
    organizer: string
    place: string
}

type RaceCardProps = {
    race: Race
    isSignedUp: boolean
    isLoggedIn: boolean
    hasPersonalData: boolean
}

const RaceCard: React.FC<RaceCardProps> = ({ race, isSignedUp, isLoggedIn, hasPersonalData }) => {
    const raceDate = typeof race.date === 'string' ? new Date(race.date) : race.date

    return (
        <Card>
            <Link href={`/zavod/${race.id}`}>
                <CardHeader>
                    <CardTitle>{race.name}</CardTitle>
                    <CardDescription>{raceDate.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Organizuje: {race.organizer}</p>
                    <p>Na místě: {race.place}</p>
                </CardContent>
            </Link>
            <CardFooter>
                {isSignedUp ? (
                    <div>Již jste přihlášeni na tento závod.</div>
                ) : (
                    <SignupButtonGroup raceId={race.id} isLoggedIn={isLoggedIn} hasPersonalData={hasPersonalData} />
                )}
            </CardFooter>
        </Card>
    )
}

export default RaceCard