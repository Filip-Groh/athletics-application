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

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"

import { getServerAuthSession } from "~/server/auth"

import {
    LogOut,
    LogIn,
    User
  } from "lucide-react"
  

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

export default async function MainMenu({menuItems, isAdmin}: MainMenuProps) {
    const session = await getServerAuthSession()

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {menuItems.map((item, index) => {
                    return (<MenuItem key={`menuItem${index}`} menuItem={item} isAdmin={isAdmin} />)
                })}
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:drop-shadow-none">
                            <Avatar>
                                {session?.user.image ? <AvatarImage src={session.user.image} alt="@shadcn" /> : null}
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{session ? session.user.name : "Nepřihlášený uživatel"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {session ? 
                                <>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <Link href="/api/auth/signout">
                                            Odhlásit se
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            :
                                <>
                                    <DropdownMenuItem>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        <Link href="/api/auth/signin">
                                            Přihlásit se
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}