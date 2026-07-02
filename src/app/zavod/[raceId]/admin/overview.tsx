import React from 'react'
import OverviewForm from '~/components/forms/overviewForm'
import type { RouterOutputs } from '~/trpc/react'

type OverviewTabProps = {
    race: NonNullable<RouterOutputs["race"]["readRaceById"]>
}

const OverviewTab: React.FC<OverviewTabProps> = ({ race }) => {
    return (
        <OverviewForm race={race} />
    )
}

export default OverviewTab