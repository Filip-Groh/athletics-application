import React from 'react'
import RegistredTable from '~/components/tables/registredTable'
import type { RouterOutputs } from '~/trpc/react'

function RegistredTab({race}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>}) {
    return (
        <RegistredTable defaultData={race.racer}/>
    )
}

export default RegistredTab