"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
} from "~/components/ui/form"
import { toast } from "sonner"
import { api } from '~/trpc/react'
import TextInput from './fields/textInput'
import { formatSex } from '~/lib/utils'

function NewSubEventForm({eventId}: {eventId: number}) {
    const utils = api.useUtils()

    const createEvent = api.subevent.createSubEvent.useMutation({
        async onSuccess(data) {
            toast(`Nová disciplína "${data.name}" pro "${data.event.name} - ${formatSex(data.event.category, true)}" byla přidána.`)
            await utils.event.getEvents.invalidate()
            form.reset()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        createEvent.mutate({
            name: values.name,
            a: Number(values.a),
            b: Number(values.b),
            c: Number(values.c),
            eventId: eventId
        })
    }

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno disciplíny musí mít alespoň 1 znak.",
        }),
        a: z.string(),
        b: z.string(),
        c: z.string()
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            a: "1",
            b: "1",
            c: "1"
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextInput form={form} fieldName='name' label='Jméno disciplíny' placeholder='Jméno disciplíny' description='Napište jméno disciplíny.' />
                <TextInput form={form} fieldName='a' label='Parametr A' placeholder='Hodnota A' description='Napište hodnotu parametru A, který se použije při výpočtu bodů. (a * (naměřená hodnota * koeficient - b) na c)' />
                <TextInput form={form} fieldName='b' label='Parametr B' placeholder='Hodnota B' description='Napište hodnotu parametru B, který se použije při výpočtu bodů. (a * (naměřená hodnota * koeficient - b) na c)' />
                <TextInput form={form} fieldName='c' label='Parametr C' placeholder='Hodnota C' description='Napište hodnotu parametru C, který se použije při výpočtu bodů. (a * (naměřená hodnota * koeficient - b) na c)' />
                <Button type="submit" disabled={createEvent.isPending}>Vytvořit disciplínu</Button>
            </form>
        </Form>
    )
}

export default NewSubEventForm