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
import { Button } from '../ui/button'

function TodaysRaceCards() {
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
                        <Link key={`race_${race.id}`} href={`/zavod/${race.id}`}>
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
                                    <Button asChild>
                                        <Link href={`/zavod/${race.id}/prihlasky`}>
                                            Přihlásit se na závod
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
            </>
        )
    }
}

export default TodaysRaceCards