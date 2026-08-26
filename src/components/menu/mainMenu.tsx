import * as React from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
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

import { Button } from "~/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"
import { Separator } from "~/components/ui/separator"

import { getServerAuthSession, type UserRole } from "~/server/auth"

import SignoutButton from "./signoutButton";
import SigninButton from "./signinButton";
  

export type MenuItemType = {
    text: string,
    link: string,
    minRole: UserRole | false
}

/** Shared role-gating logic used by both desktop and mobile navigation variants. */
export const hasRequiredRole = (role: UserRole | false, minRole: UserRole | false): boolean =>
    (role !== false ? role : -1) >= (minRole !== false ? minRole : -1)

interface MenuItemProps {
    menuItem: MenuItemType,
    role: UserRole | false
}

const MenuItem = ({menuItem, role}: MenuItemProps) => {
    if (hasRequiredRole(role, menuItem.minRole)) {
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

const MainMenu = async ({menuItems, role}: MainMenuProps) => {
    const session = await getServerAuthSession()
    const visibleItems = menuItems.filter((item) => hasRequiredRole(role, item.minRole))

    return (
        <div className="flex w-full items-center justify-between gap-2">
            {/* Mobile: title + hamburger drawer */}
            <div className="flex items-center gap-1 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Otevřít menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72">
                        <SheetHeader>
                            <SheetTitle>Atletika</SheetTitle>
                        </SheetHeader>
                        <nav className="mt-4 flex flex-col gap-1">
                            {visibleItems.map((item, index) => (
                                <Link
                                    key={`mobileMenuItem${index}`}
                                    href={item.link}
                                    className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </nav>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Téma</span>
                                <ModeToggle />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-medium">{session ? session.user.name : "Nepřihlášený uživatel"}</span>
                                {session ? <SignoutButton /> : <SigninButton />}
                            </div>
                            {session ?
                                <Link
                                    href="/ucet"
                                    className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Přehled
                                </Link>
                            : null}
                        </div>
                    </SheetContent>
                </Sheet>
                <Link href="/" className="text-lg font-semibold tracking-tight">
                    Atletika
                </Link>
            </div>

            {/* Desktop: horizontal navigation */}
            <NavigationMenu className="hidden md:flex">
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
        </div>
    )
}

export default MainMenu