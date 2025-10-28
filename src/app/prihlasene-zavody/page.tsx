import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

async function PrihlaseneZavodyPage() {
    const session = await getServerAuthSession()

    const signUpRaces = await api.race.getSignUpRaces()

    if (!session) {
        return <p>Pro zobrazení přihlášených závodů se musíte přihlásit.</p>
    }

    if (signUpRaces.length === 0) {
        return <p>Momentálně nemáte přihlášené žádné závody.</p>
    }

    return (
        <>
            <p>Závody kam jsem se zapsal:</p>
            <div>
                {signUpRaces.map((race) => {
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

export default PrihlaseneZavodyPage