"use client"

import React from 'react'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { FcGoogle } from "react-icons/fc"

function SigninButton({callbackUrl}: {callbackUrl?: string}) {
    const path = usePathname();

    return (
        <Button variant="ghost" onClick={async () => signIn("google", {callbackUrl: callbackUrl ?? path})}>
            <FcGoogle className="mr-2 h-6 w-6" />
            Přihlásit se Google účtem
        </Button>
    )
}

export default SigninButton