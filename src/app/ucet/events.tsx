"use client"

import React from 'react'
import TreeTabs, { type DropdownNode, type SingleNode } from '~/components/elements/treeTabs'
import EventForm from '~/components/forms/eventForm'
import NewEventForm from '~/components/forms/newEventForm'
import NewSubEventForm from '~/components/forms/newSubEventForm'
import NewSubEventOnlyForm from '~/components/forms/newSubEventOnlyForm'
import SubEventForm from '~/components/forms/subEventForm'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import { formatSex } from '~/lib/utils'
import { api } from '~/trpc/react'

const Events = () => {
    const getEventsQuery = api.event.getEvents.useQuery()

    return (
        <QueryWrapper
            query={getEventsQuery}
            transform={(events) => {
                return events.map((event) => {
                    if (event.name) {
                        return {
                            isDropdown: true,
                            triggerText: `${event.name} - ${formatSex(event.category, true)}`,
                            uniqueId: `event_${event.id}`,
                            content: (
                                <>
                                    <EventForm event={event} />
                                    <NewSubEventForm eventId={event.id} />
                                </>
                            ),
                            dropdownNodes: event.subEvent.map((subEvent) => {
                                return {
                                    isDropdown: false,
                                    triggerText: `${subEvent.name} - ${formatSex(event.category, true)}`,
                                    uniqueId: `event_${event.id}:subEvent_${subEvent.id}`,
                                    content: (
                                        <>
                                            <SubEventForm subEvent={subEvent} isForEvent={false} eventId={event.id} />
                                        </>
                                    )
                                }
                            })
                        } as DropdownNode
                    } else {
                        return {
                            isDropdown: false,
                            triggerText: `${event.subEvent[0]?.name} - ${formatSex(event.category, true)}`,
                            uniqueId: `event_${event.id}:subEvent_${event.subEvent[0]?.id}`,
                            content: (
                                <>
                                    <SubEventForm subEvent={event.subEvent[0]!} isForEvent={true} eventId={event.id} />
                                </>
                            )
                        } as SingleNode
                    }
                }).concat([
                    {
                        isDropdown: false,
                        triggerText: "Přidat skupinu disciplín",
                        uniqueId: "addEvent",
                        content: (
                            <>
                                <NewEventForm />
                            </>
                        )
                    },
                    {
                        isDropdown: false,
                        triggerText: "Přidat disciplínu",
                        uniqueId: "addSubEvent",
                        content: (
                            <>
                                <NewSubEventOnlyForm />
                            </>
                        )
                    }
                ])
            }}
            Success={(tree) => (
                <div>
                    <TreeTabs tree={tree} />
                </div>
            )}
        />
    )
}

export default Events