"use client"

import { api } from '~/trpc/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import Link from 'next/link'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { Pencil } from 'lucide-react'

const PrihlaseneZavodyClientPage = () => {
    const getSignUpRacesQuery = api.race.getSignUpRaces.useQuery()

    return (
        <QueryWrapper
            query={getSignUpRacesQuery}
            Empty={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                    <Pencil className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Momentálně nemáte přihlášené žádné závody.</p>
                </div>}
            Success={(data) => (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Pencil />
                        <span>Závody kam jsem se zapsal:</span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {data.map((race) => {
                            return (
                                <Link key={`race_${race.id}`} href={`/zavod/${race.id}`}>
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
                </div>
            )
            }
        />
    )
}

export default PrihlaseneZavodyClientPage