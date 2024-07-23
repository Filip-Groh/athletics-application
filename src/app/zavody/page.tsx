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
import { api } from "~/trpc/server";
  

async function ZavodyPage() {
    const races = await api.race.getRaces({
        includeHidden: true
    })

    return (
        <div>
            {races.map((race) => {
                return (
                    <Link key={`race_${race.id}`} href={`/zavody/${race.id}`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{race.name}</CardTitle>
                                <CardDescription>Koná se {race.date.toLocaleDateString()}</CardDescription>
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
    )
}

export default ZavodyPage