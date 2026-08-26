import { Crown, PenLine } from 'lucide-react';
import React from 'react'
import AssignedRaceCards from '~/components/elements/assignedRaceCards';
import OwnedRaceCards from '~/components/elements/ownedRaceCards';
import { getServerAuthSession, UserRole } from '~/server/auth';  

const ZavodyPage: React.FC = async () => {
    const session = await getServerAuthSession()

    return (
        <div>
            {(session?.user.role ?? 0) >= UserRole.RaceManager ? <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Crown />
                    <span>Mnou pořádané závody:</span>
                </h2>
                <OwnedRaceCards />
            </> : null}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PenLine />
                <span>Závody kde jsem zapisovatel:</span>
            </h2>
            <AssignedRaceCards />
        </div>
    )
}

export default ZavodyPage