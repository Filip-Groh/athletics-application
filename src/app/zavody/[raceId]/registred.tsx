import React from 'react'
import RegistredTable from '~/components/tables/registredTable'
import type { Race } from '~/server/types/race'

function RegistredTab({race}: {race: Race}) {
    return (
        <RegistredTable data={race.racer}/>
    )
}

export default RegistredTab