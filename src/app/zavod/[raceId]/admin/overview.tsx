import React from 'react'
import OverviewForm from '~/components/forms/overviewForm'
import type { RouterOutputs } from '~/trpc/react'

function OverviewTab({race}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>}) {
    return (
        <>
            <OverviewForm race={race} />
        </>
    )
}

export default OverviewTab