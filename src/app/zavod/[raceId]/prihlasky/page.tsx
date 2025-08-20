import Link from 'next/link';
import React from 'react'
import { Button } from '~/components/ui/button';

// async function AttendRequestPage() {
//     const races = await api.race.getRaces({
//         includeHidden: false
//     })

//     return (
//         <NewRacerForm races={races} />
//     )
// }

function AttendRequestPage() {
    return (
        <div>
            <Button asChild>
                <Link href={`./prihlasky/ucet`}>
                    Přihlásit se účtem
                </Link>
            </Button>
            <Button asChild>
                <Link href={`./prihlasky/anonym`}>
                    Přihlásit se bez účtu
                </Link>
            </Button>
        </div>
    )
}

export default AttendRequestPage