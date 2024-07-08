import Link from 'next/link'
import React from 'react'

export type RaceMenuItemType = {
    text: string,
    link: string
}

interface RaceMenuItemProps {
    menuItem: RaceMenuItemType
}

function RaceMenuItem({menuItem}: RaceMenuItemProps) {
    return (
        <li><Link href={menuItem.link}>{menuItem.text}</Link></li>
    )
}

interface RaceMenuProps {
    menuItems: Array<RaceMenuItemType>
}

function RaceMenu({menuItems}: RaceMenuProps) {
    return (
        <nav>
            <menu className='flex flex-row justify-evenly'>
                {menuItems.map((item, index) => {
                    return (<RaceMenuItem key={`raceMenuItem${index}`} menuItem={item} />)
                })}
            </menu>
        </nav>
    )
}

export default RaceMenu