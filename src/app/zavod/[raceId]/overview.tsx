import React from 'react'
import { Calendar, MapPin, User, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatSex } from '~/lib/utils'
import { type RouterOutputs } from '~/trpc/react'

type OverviewTabProps = {
    race: NonNullable<RouterOutputs["race"]["getRaceByIdPublic"]>
}

const OverviewTab: React.FC<OverviewTabProps> = ({ race }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {race.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                        <span>
                            Koná se <strong>{race.date.toLocaleDateString()}</strong> v{' '}
                            <strong>
                                {race.date.toLocaleTimeString(
                                    typeof window !== 'undefined' ? navigator.language : 'cs-CZ',
                                    { hour: '2-digit', minute: '2-digit' }
                                )}
                            </strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                        <span>
                            Místo: <strong>{race.place}</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                        <span>
                            Pořádá <strong>{race.organizer}</strong>
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Trophy />
                    <span>Disciplíny:</span>
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                    {race.event.map((event) => (
                        <div
                            key={`event_${event.id}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-card text-card-foreground shadow-sm"
                        >
                            <span className="font-medium text-gray-900 dark:text-white">
                                {event.name ?? event.subEvent[0]?.name}
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                {formatSex(event.category, true)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OverviewTab