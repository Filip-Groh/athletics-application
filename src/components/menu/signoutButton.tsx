"use client"

import React from 'react'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const SignoutButton: React.FC = () => {
    return (
        <Button variant="ghost" onClick={async () => signOut({callbackUrl: "/"})}>
            <LogOut className="mr-2 h-4 w-4" />
            Odhlásit se
        </Button>
    )
}

export default SignoutButton