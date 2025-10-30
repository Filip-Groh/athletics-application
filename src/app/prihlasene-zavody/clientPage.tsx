"use client"

import { api } from '~/trpc/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import Link from 'next/link'

function PrihlaseneZavodyClientPage() {
    const {data, isSuccess, isLoading, error} = api.race.getSignUpRaces.useQuery()
    
    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        if (data.length === 0) {
            return <p>Momentálně nemáte přihlášené žádné závody.</p>
        }

        return (
            <>
                <p>Závody kam jsem se zapsal:</p>
                <div>
                    {data.map((race) => {
                        return (
                            <Link key={`race_${race.id}`} href={`/zavod/${race.id}`}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{race.name}</CardTitle>
                                        <CardDescription>Koná se {race.date.toLocaleDateString()} v {race.date.toLocaleTimeString(navigator.language, {hour: "2-digit", minute: "2-digit"})}</CardDescription>
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
            </>
        )
    }
}

export default PrihlaseneZavodyClientPage