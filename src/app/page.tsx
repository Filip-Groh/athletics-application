import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import HomeClientPage from './clientPage'

const HomePage = async () => {
    const session = await getServerAuthSession()
    const optionalPersonalData = session?.user.personalData
    const personalData = optionalPersonalData ?? null

    return (
        <HomeClientPage isSession={session !== null} hasPersonalData={personalData !== null} />
    )
}

export default HomePage


/*
TODO:
- Edit racer info
- Show unsaved progress
- Tables control
- Dynamic update
- Prisma error handling
- Page stylying
- Race search
- Tooltips and anomalies (problems with data)
*/

/*
COMMENTS:
- Uzamknout startovací pořadí (race manager)
*/