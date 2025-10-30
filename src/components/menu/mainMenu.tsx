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

import { getServerAuthSession, type UserRole } from "~/server/auth"

import {
    User
  } from "lucide-react"
import SignoutButton from "./signoutButton";
import SigninButton from "./signinButton";
  

export type MenuItemType = {
    text: string,
    link: string,
    minRole: UserRole | false
}

interface MenuItemProps {
    menuItem: MenuItemType,
    role: UserRole | false
}

function MenuItem({menuItem, role}: MenuItemProps) {
    if ((role !== false ? role : -1) >= (menuItem.minRole !== false ? menuItem.minRole : -1)) {
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
    role: UserRole | false
}

export default async function MainMenu({menuItems, role}: MainMenuProps) {
    const session = await getServerAuthSession()

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {menuItems.map((item, index) => {
                    return (<MenuItem key={`menuItem${index}`} menuItem={item} role={role} />)
                })}
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:drop-shadow-none">
                            <Avatar>
                                {session?.user.image ? <AvatarImage src={session.user.image} alt="Avatar image" /> : null}
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
                                    <DropdownMenuItem>
                                        <Link href="/ucet">
                                            Přehled
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <SignoutButton />
                                    </DropdownMenuItem>
                                </>
                            :
                                <>
                                    <DropdownMenuItem>
                                        <SigninButton />
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