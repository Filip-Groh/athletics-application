import Link from 'next/link'
import React from 'react'

export type EventMenuItemType = {
    text: string,
    link: string
}

interface EventMenuItemProps {
    menuItem: EventMenuItemType
}

function EventMenuItem({menuItem}: EventMenuItemProps) {
    return (
        <li><Link href={menuItem.link}>{menuItem.text}</Link></li>
    )
}

interface EventMainMenuProps {
    menuItems: Array<EventMenuItemType>
}

function EventMenu({menuItems}: EventMainMenuProps) {
    return (
        <nav>
            <menu className='flex flex-col gap-1'>
                {menuItems.map((item, index) => {
                    return (<EventMenuItem key={`eventMenuItem${index}`} menuItem={item} />)
                })}
            </menu>
        </nav>
    )
}

export default EventMenu