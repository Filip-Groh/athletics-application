import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import SigninButton from '../menu/signinButton'

function SignupButtonGroup({raceId, isLoggedIn, hasPersonalData}: {raceId: number, isLoggedIn: boolean, hasPersonalData: boolean}) {
    const router = useRouter()

    const accountButtonEnabled = (
        <Button onClick={() => router.push(`/zavod/${raceId}/prihlaseni-ucet`)}>
            Přihlásit se účtem
        </Button>
    )

    const accountButtonDisabledNotLoggedIn = (
        <SigninButton callbackUrl={`/zavod/${raceId}/prihlaseni-ucet`} />
    )

    const accountButtonDisabledHasNoPersonalData = (
        <Tooltip>
            <TooltipTrigger>
                <Button variant="secondary" disabled>
                    Přihlásit se účtem
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Musíte vyplnit osobní údaje v profilu. (Vpravo nahoře Profil -&gt; Přehled)</p>
            </TooltipContent>
        </Tooltip>
    )

    let accountButton = null
    if (!isLoggedIn) {
        accountButton = accountButtonDisabledNotLoggedIn
    } else if (!hasPersonalData) {
        accountButton = accountButtonDisabledHasNoPersonalData
    } else {
        accountButton = accountButtonEnabled
    }

    return (
        <>
            {accountButton}
            <Button onClick={() => router.push(`/zavod/${raceId}/prihlaseni-anonym`)}>
                Přihlásit se bez účtu
            </Button>
        </>
    )
}

export default SignupButtonGroup