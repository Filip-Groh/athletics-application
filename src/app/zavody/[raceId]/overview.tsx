import React from 'react'
import OverviewForm from '~/components/forms/overviewForm'
import { type RacePreview } from '~/server/types/race'

function OverviewTab({race}: {race: RacePreview}) {
    return (
        <OverviewForm race={race} />
    )
}

export default OverviewTab