"use client"

import React from 'react'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import UsersTable from '~/components/tables/usersTable'
import { api } from '~/trpc/react'

const Roles = () => {
    const getUsersQuery = api.user.getUsers.useQuery()

    return (
        <QueryWrapper
            query={getUsersQuery}
            Success={(data) => {
                return (
                    <UsersTable users={data} />
                )
            }}
        />
    )
}

export default Roles