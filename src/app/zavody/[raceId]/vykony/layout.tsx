import {type ReactNode } from 'react'
import EventMenu, { type EventMenuItemType } from '~/app/components/menu/eventMenu'

function VykonyLayout({children, params}: {children: ReactNode, params: {raceId: string}}) {
    const eventMenuItems: Array<EventMenuItemType> = [
        {
            text: "Disciplína 1",
            link: `/zavody/${params.raceId}/vykony`
        },
        {
            text: "Disciplína 2",
            link: `/zavody/${params.raceId}/vykony/2`
        },
        {
            text: "Disciplína 3",
            link: `/zavody/${params.raceId}/vykony/3`
        },
        {
            text: "Disciplína 4",
            link: `/zavody/${params.raceId}/vykony/4`
        }
    ]

    return (
        <>
            <EventMenu menuItems={eventMenuItems} />
            {children}
        </>
    )
}

export default VykonyLayout