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
import { Crown } from 'lucide-react'

const OwnedRaceCards: React.FC = () => {
    const getOwnedRacesQuery = api.race.getOwnedRaces.useQuery()

    return (
        <QueryWrapper
            query={getOwnedRacesQuery}
            Empty={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                    <Crown className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Momentálně nepořádáte žádné závody.</p>
                </div>
            }
            Success={(data) => (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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