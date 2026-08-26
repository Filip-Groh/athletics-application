import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme/theme-provider"
import MainMenu, { type MenuItemType } from "~/components/menu/mainMenu";
import { Toaster } from "~/components/ui/sonner"
import { HydrateClient } from "~/trpc/server";
import { getServerAuthSession, UserRole } from "~/server/auth"
import { TooltipProvider } from "~/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
    title: "Atletika",
    description: "Vrhačské závody a výkony",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const menuItems: Array<MenuItemType> = [
    {
        text: "Závody",
        link: "/",
        minRole: false
    },
        {
        text: "Historie závodů",
        link: "/historie",
        minRole: false
    },
    {
        text: "Přihlášené závody",
        link: "/prihlasene-zavody",
        minRole: UserRole.Racer
    },
    {
        text: "Zápis výkonů",
        link: "/zavod",
        minRole: UserRole.EventManager
    }
]

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
    const session = await getServerAuthSession()

    return (
        <html lang="cs" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body>
                <TRPCReactProvider>
                    <TooltipProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
                            <header className="sticky top-0 z-50 w-full border-b bg-background">
                                <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 md:px-6">
                                    <MainMenu menuItems={menuItems} role={session?.user.role ?? false}/>
                                </div>
                            </header>
                            <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
                                <HydrateClient>
                                    {children}
                                </HydrateClient>
                            </main>
                            <Toaster />
                        </ThemeProvider>
                    </TooltipProvider>
                </TRPCReactProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}

export default RootLayout