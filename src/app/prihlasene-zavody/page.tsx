import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import PrihlaseneZavodyClientPage from './clientPage'

const PrihlaseneZavodyPage = async () => {
    const session = await getServerAuthSession()

    if (!session) {
        return <p>Pro zobrazení přihlášených závodů se musíte přihlásit.</p>
    }

    return (
        <PrihlaseneZavodyClientPage />
    )
}

export default PrihlaseneZavodyPage