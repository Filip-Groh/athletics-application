"use client"

import React from 'react'
import UsersTable from '~/components/tables/usersTable'
import { api } from '~/trpc/react'

function Roles() {
    const {data, isSuccess, isLoading, error} = api.user.getUsers.useQuery()

    if (error) {
        return <div>Nastala chyba: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (isSuccess) {
        return (
            <UsersTable users={data}/>
        )
    }
}

export default Roles