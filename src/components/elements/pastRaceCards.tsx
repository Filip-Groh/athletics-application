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
import QueryWrapper from '../wrappers/QueryWrapper'

type PastRaceCardsProps = {
    page: number,
    pageSize: number
}

const PastRaceCards: React.FC<PastRaceCardsProps> = ({ page, pageSize }) => {
    const getPastRacesQuery = api.race.getPastRaces.useQuery({ page, pageSize })

    return (
        <QueryWrapper
            query={getPastRacesQuery}
            Success={(data) => (
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
            )}
        />
    )
}

export default PastRaceCards