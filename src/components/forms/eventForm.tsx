"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
} from "~/components/ui/form"
import { formatSex } from "~/lib/utils"
import { toast } from "sonner"
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'
import DeleteConfirm from '../elements/deleteConfirm'
import TextInput from './fields/textInput'

function EventForm({event}: {event: NonNullable<RouterOutputs["event"]["getEvents"]>[0]}) {
    const utils = api.useUtils()

    const updateEvent = api.event.updateEvent.useMutation({
        async onSuccess(data) {
            toast(`Skupina disciplín "${data.name} - ${formatSex(data.category, true)}" byla upravena.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteEvent = api.event.deleteEvent.useMutation({
        async onSuccess(data) {
            toast(`Skupina disciplín "${data.name} - ${formatSex(data.category, true)}" byla smazána.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        updateEvent.mutate({
            id: event.id,
            name: values.name
        })
    }

    const onDelete = () => {
        deleteEvent.mutate({
            id: event.id
        })
    }

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: event.name ?? ""
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2">
                <TextInput form={form} fieldName='name' label='Jméno skupiny disciplín' placeholder='Jméno' description='Napište jméno skupiny disciplín.' />
                <div className='flex flex-row gap-2 mt-8 mb-2'>
                    <Button type="submit" disabled={updateEvent.isPending || deleteEvent.isPending}>Updatovat</Button>
                    <DeleteConfirm onConfirm={onDelete}>
                        <Button variant="destructive" disabled={updateEvent.isPending || deleteEvent.isPending}>Vymazat</Button>
                    </DeleteConfirm>
                </div>
            </form>
        </Form>
    )
}

export default EventForm