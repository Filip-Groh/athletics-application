import React from 'react'
import RegistredTable from '~/components/tables/registredTable'
import type { RouterOutputs } from '~/trpc/react'

type RegistredTabProps = {
    race: NonNullable<RouterOutputs["race"]["readRaceById"]>,
    isRaceManagerOrAbove: boolean
}

const RegistredTab: React.FC<RegistredTabProps> = ({ race, isRaceManagerOrAbove }) => {
    return (
        <RegistredTable defaultData={race.racer} isRaceManagerOrAbove={isRaceManagerOrAbove} />
    )
}

export default RegistredTab