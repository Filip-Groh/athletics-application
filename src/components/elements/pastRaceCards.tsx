"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { api } from '~/trpc/react'
import Link from 'next/link'

function PastRaceCards({page, pageSize}: {page: number, pageSize: number}) {
    const {data, isSuccess, isLoading, error} = api.race.getPastRaces.useQuery({page, pageSize})

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
                        <Link key={`race_${race.id}`} href={`/zavod/${race.id}`}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{race.name}</CardTitle>
                                    <CardDescription>{race.date.toLocaleString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Organizoval: {race.organizer}</p>
                                    <p>Na místě: {race.place}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </>
        )
    }
}

export default PastRaceCards