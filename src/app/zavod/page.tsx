import Link from 'next/link'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"
import { getServerAuthSession, UserRole } from '~/server/auth';
import { api } from "~/trpc/server";
  

async function ZavodyPage() {
    const session = await getServerAuthSession()

    const ownedRaces = await api.race.getOwnedRaces()
    const assignedRaces = await api.race.getAssignedRaces()

    return (
        <>
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <>
                <p>Mnou pořádané závody:</p>
                <div>
                    {ownedRaces.map((race) => {
                        return (
                            <Link key={`race_${race.id}`} href={`/zavod/${race.id}/admin`}>
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
            </> : null}
            <p>Závody kde jsem zapisovatel:</p>
            <div>
                {assignedRaces.map((race) => {
                    return (
                        <Link key={`race_${race.id}`} href={`/zavod/${race.id}/admin`}>
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

export default ZavodyPage