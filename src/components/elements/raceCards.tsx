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
import { api } from '~/trpc/react'
import Link from 'next/link'

function RaceCards() {
    const {data, isSuccess, isLoading, error} = api.race.getOwnedRaces.useQuery()

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        return (
            <>
                {data.map((race) => {
                    return (
                        <Link href={`/zavod/${race.id}/admin`} key={`race_${race.id}`}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{race.name}</CardTitle>
                                    <CardDescription>{race.date.toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Organizuje: {race.organizer}</p>
                                    <p>Na místě: {race.place}</p>
                                </CardContent>
                                <CardFooter>
                                    <p>{race.visible ? "Veřejný závod" : "Skrytý závod"}</p>
                                </CardFooter>
                            </Card>
                        </Link>

                    )
                })}
            </>
        )
    }
}

export default RaceCards