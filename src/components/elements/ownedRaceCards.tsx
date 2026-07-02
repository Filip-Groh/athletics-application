"use client"

import React from 'react'
import { api } from '~/trpc/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import Link from 'next/link'
import QueryWrapper from '../wrappers/QueryWrapper'

const OwnedRaceCards: React.FC = () => {
    const getOwnedRacesQuery = api.race.getOwnedRaces.useQuery()

    return (
        <QueryWrapper
            query={getOwnedRacesQuery}
            Success={(data) => (
                <div>
                    {data.map((race) => {
                        return (
                            <Link key={`race_${race.id}`} href={`/zavod/${race.id}/admin`}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{race.name}</CardTitle>
                                        <CardDescription>Koná se {race.date.toLocaleDateString()} v {race.date.toLocaleTimeString(navigator.language, { hour: "2-digit", minute: "2-digit" })}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Závod se pořádá zde: {race.place}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <p>Pořádá {race.organizer}</p>
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        />
    )
}

export default OwnedRaceCards