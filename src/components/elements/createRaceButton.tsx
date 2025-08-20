"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '~/components/ui/button'
import { PlusSquare } from 'lucide-react'

function CreateRaceButton() {
    const router = useRouter()

    return (
        <Button variant='default' onClick={() => router.push("/zavod/novy")}>
            Vytvořit nový závod
            <PlusSquare className='w-8 h-8 ml-2' />
        </Button>
    )
}

export default CreateRaceButton