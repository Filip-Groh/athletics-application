import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"
import { getRaces } from '~/server/db/race'

export default async function HomePage() {
    const races = await getRaces()

    return (
        <div>
            {races.map((race) => {
                return (
                    <Card key={`race_${race.id}`}>
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
                )
            })}
        </div>
    );
}
