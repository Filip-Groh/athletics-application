import Link from 'next/link'
import React from 'react'

export type MenuItemType = {
    text: string,
    link: string,
    adminOnly: boolean
}

interface MenuItemProps {
    menuItem: MenuItemType,
    isAdmin: boolean
}

function MenuItem({menuItem, isAdmin}: MenuItemProps) {
    if (!menuItem.adminOnly || isAdmin) {
        return (
            <li><Link href={menuItem.link}>{menuItem.text}</Link></li>
        )
    }
}

interface MainMenuProps {
    menuItems: Array<MenuItemType>,
    isAdmin: boolean
}

function MainMenu({menuItems, isAdmin}: MainMenuProps) {
    return (
        <nav>
            <menu className='flex flex-row justify-evenly'>
                {menuItems.map((item, index) => {
                    return (<MenuItem key={`menuItem${index}`} menuItem={item} isAdmin={isAdmin} />)
                })}
            </menu>
        </nav>
    )
}

export default MainMenu