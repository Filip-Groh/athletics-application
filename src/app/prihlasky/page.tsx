import React from 'react'
import NewRacerForm from '~/components/forms/newRacerForm'
import { getRaces } from '~/server/db/race'

async function PrihlaskyPage() {
    const races = await getRaces()

    return (
        <NewRacerForm races={races} />
    )
}

export default PrihlaskyPage