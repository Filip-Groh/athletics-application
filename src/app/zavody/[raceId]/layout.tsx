import {type ReactNode } from 'react'
import RaceMenu, { type RaceMenuItemType } from '~/app/components/menu/raceMenu'

function ZavodLayout({children, params}: {children: ReactNode, params: {raceId: string}}) {
    const raceMenuItems: Array<RaceMenuItemType> =[
        {
            text: "Přehled",
            link: `/zavody/${params.raceId}`
        },
        {
            text: "Registrovaní soutěžící",
            link: `/zavody/${params.raceId}/soutezici`
        },
        {
            text: "Výkony",
            link: `/zavody/${params.raceId}/vykony`
        },
        {
            text: "Bodování",
            link: `/zavody/${params.raceId}/bodovani`
        },
        {
            text: "Záloha",
            link: `/zavody/${params.raceId}/zaloha`
        }
    ]

    return (
        <>
            <RaceMenu menuItems={raceMenuItems} />
            {children}
        </>
    )
}

export default ZavodLayout