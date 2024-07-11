import * as React from "react"
import Link from "next/link"
import { ModeToggle } from "~/components/theme/theme-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"

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
            <NavigationMenuItem>
                <Link href={menuItem.link} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {menuItem.text}
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
        )
    }
}

interface MainMenuProps {
    menuItems: Array<MenuItemType>,
    isAdmin: boolean
}

export default function MainMenu({menuItems, isAdmin}: MainMenuProps) {
  return (
    <NavigationMenu>
        <NavigationMenuList>
            {menuItems.map((item, index) => {
                return (<MenuItem key={`menuItem${index}`} menuItem={item} isAdmin={isAdmin} />)
            })}
            <NavigationMenuItem>
                <ModeToggle />
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
  )
}