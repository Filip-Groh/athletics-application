import { redirect } from 'next/navigation'
import React from 'react'
import { getServerAuthSession } from "~/server/auth"

const AuthLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const session = await getServerAuthSession()

    if (!session) {
        redirect("/")
    }

    return (
        <>
            {children}
        </>
    )
}

export default AuthLayout