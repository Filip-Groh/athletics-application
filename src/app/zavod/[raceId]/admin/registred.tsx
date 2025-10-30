import React from 'react'
import RegistredTable from '~/components/tables/registredTable'
import type { RouterOutputs } from '~/trpc/react'

function RegistredTab({race, isRaceManagerOrAbove}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>, isRaceManagerOrAbove: boolean}) {
    return (
        <RegistredTable defaultData={race.racer} isRaceManagerOrAbove={isRaceManagerOrAbove} />
    )
}

export default RegistredTab