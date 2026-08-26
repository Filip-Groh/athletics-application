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
import QueryWrapper from '../wrappers/QueryWrapper'
import { Crown } from 'lucide-react'

const RaceCards: React.FC = () => {
    const getOwnedRacesQuery = api.race.getOwnedRaces.useQuery()

    return (
        <QueryWrapper
            query={getOwnedRacesQuery}
            Empty={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                    <Crown className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Nepořádáte žádné závody.</p>
                </div>
            }
            Success={(data) => (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                </div>
            )}
        />
    )
}

export default RaceCards