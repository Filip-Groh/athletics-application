import React from 'react'
import PersonalDataForm from '~/components/forms/personalDataForm'
import { getServerAuthSession } from '~/server/auth'

async function Overview() {
    const session = await getServerAuthSession()
    return (
        <PersonalDataForm personalInformation={session?.user.personalData}/>
    )
}

export default Overview