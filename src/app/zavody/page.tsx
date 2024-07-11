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
import { getRaces } from '~/server/db/race'
  

async function ZavodyPage() {
    const races = await getRaces()

    return (
        <div>
            {races.map((race) => {
                return (
                    <Link key={`race_${race.id}`} href={`/zavody/${race.id}`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{race.name}</CardTitle>
                                <CardDescription>{race.date.toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{race.organizer}</p>
                            </CardContent>
                            <CardFooter>
                                <p>{race.createdAt.toLocaleString()}</p>
                            </CardFooter>
                        </Card>
                    </Link>
                )
            })}

        </div>
    )
}

export default ZavodyPage