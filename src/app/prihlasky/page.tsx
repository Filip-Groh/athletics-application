import React from 'react'
import NewRacerForm from '~/components/forms/newRacerForm'
import { api } from "~/trpc/server";

async function PrihlaskyPage() {
    const races = await api.race.getRaces({
        includeHidden: false
    })

    return (
        <NewRacerForm races={races} />
    )
}

export default PrihlaskyPage