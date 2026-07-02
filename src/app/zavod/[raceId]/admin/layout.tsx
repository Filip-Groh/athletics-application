import { redirect } from 'next/navigation'
import React from 'react'
import { getServerAuthSession } from "~/server/auth"

const AdminLayout: React.FC<React.PropsWithChildren> = async ({children}) => {
    const session = await getServerAuthSession()

    if (!session) {
        redirect("/")
    }

    return (
        <>{children}</>
    )
}

export default AdminLayout