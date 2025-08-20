"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
} from "~/components/ui/form"
import { formatSex, inputStringToNumber } from "~/lib/utils"
import { toast } from "sonner"
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'
import DeleteConfirm from '../elements/deleteConfirm'
import TextInput from './fields/textInput'

function SubEventForm({subEvent, isForEvent, eventId}: {subEvent: NonNullable<RouterOutputs["event"]["getEvents"]>[0]["subEvent"][0], isForEvent: boolean, eventId: number}) {
    const utils = api.useUtils()

    const updateSubEvent = api.subevent.updateSubEvent.useMutation({
        async onSuccess(data) {
            toast(`Disciplína "${data.name} - ${formatSex(data.event.category, true)}" byla upraven.`)
            await utils.event.getEvents.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteSubEvent = api.subevent.deleteSubEvent.useMutation({
        async onSuccess(data) {
            toast(`Disciplína "${data.name} - ${formatSex(data.event.category, true)}" byla smazána.`)
            await utils.event.getEvents.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteEvent = api.event.deleteEvent.useMutation({
        async onSuccess(data) {
            toast(`Disciplína "${data.name} - ${formatSex(data.category, true)}" byla smazána.`)
            await utils.event.getEvents.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        updateSubEvent.mutate({
            id: subEvent.id,
            name: values.name,
            a: inputStringToNumber(values.a),
            b: inputStringToNumber(values.b),
            c: inputStringToNumber(values.c)
        })
    }

    const onDelete = () => {
        if (isForEvent) {
            deleteEvent.mutate({
                id: eventId
            })
        } else {
            deleteSubEvent.mutate({
                id: subEvent.id
            })
        }
    }

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        }),
        a: z.string(),
        b: z.string(),
        c: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: subEvent.name,
            a: subEvent.a.toLocaleString(),
            b: subEvent.b.toLocaleString(),
            c: subEvent.c.toLocaleString()
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2">
                <TextInput form={form} fieldName='name' label='Jméno disciplíny' placeholder='Jméno' description='Napište jméno disciplíny.' />
                <TextInput form={form} fieldName='a' label='Parametr A' placeholder='Hodnota A' description='Napište hodnotu parametru A.' />
                <TextInput form={form} fieldName='b' label='Parametr B' placeholder='Hodnota B' description='Napište hodnotu parametru B.' />
                <TextInput form={form} fieldName='c' label='Parametr C' placeholder='Hodnota C' description='Napište hodnotu parametru C.' />
                <div>
                    <div className='flex flex-row gap-2 mt-8 mb-2'>
                        <Button type="submit" disabled={updateSubEvent.isPending || deleteSubEvent.isPending}>Updatovat</Button>
                        <DeleteConfirm onConfirm={onDelete}>
                            <Button variant="destructive" disabled={updateSubEvent.isPending || deleteSubEvent.isPending}>Vymazat</Button>
                        </DeleteConfirm>
                    </div>
                    <p className='text-sm text-muted-foreground'>Vzoreček: (a * (naměřená hodnota * koeficient - b) na c)</p>
                </div>
            </form>
        </Form>
    )
}

export default SubEventForm