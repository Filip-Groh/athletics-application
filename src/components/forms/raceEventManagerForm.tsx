"use client"

import React from 'react'
import { Button } from "~/components/ui/button"
import { toast } from "sonner"
import { api, type RouterOutputs } from '~/trpc/react'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { useArrayState } from '../hooks/useArrayState'

function RaceEventManagerForm({allEvents, raceEvents, raceId}: {allEvents: NonNullable<RouterOutputs["event"]["getEvents"]>, raceEvents: NonNullable<RouterOutputs["race"]["getRaceEvents"]>, raceId: number}) {
    const utils = api.useUtils()

    const {state: eventState, change: eventChange} = useArrayState(allEvents.map((event) => {
        return  {
            id: event.id,
            state: raceEvents.some((raceEvent) => raceEvent.id === event.id),
            name: event.name ?? event.subEvent[0]?.name,
            category: event.category
        }
    }))

    const setRaceEvents = api.race.setRaceEvents.useMutation({
        async onSuccess(data) {
            toast(`Závod ${data.id} má přiřazené ${data._count.event} disciplín.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        }
    })
    
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setRaceEvents.mutate({
            raceId: raceId,
            eventIds: eventState.filter((event) => {
                return event.state
            }).map((event) => {
                return event.id
            })
        })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {eventState.map((event, index) => {
                return (
                    <div key={`eventSelector_${event.id}`} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <Checkbox 
                            checked={event.state}
                            onCheckedChange={(checked) => eventChange(index, {...event, state: checked.valueOf() as boolean})}
                        />
                        <div className="space-y-1 leading-none">
                            <Label>
                                {`${event.name} - ${event.category}`}
                            </Label>
                            <p className='text-sm text-muted-foreground'>
                                Pokud zaškrtnuto disciplína bude na závodě.
                            </p>
                        </div>
                    </div>
                )
            })}
            <Button type="submit" disabled={setRaceEvents.isPending}>Uložit změnu</Button>
        </form>
    )
}

export default RaceEventManagerForm