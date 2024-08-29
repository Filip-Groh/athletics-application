"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { formatSex } from "~/lib/utils"
import { toast } from "sonner"
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'
import DeleteConfirm from '../elements/deleteConfirm'

function EventForm({event, popEvent}: {event: NonNullable<RouterOutputs["race"]["readRaceById"]>["event"][0], popEvent: (id: number) => void}) {
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        }),
        a: z.number(),
        b: z.number(),
        c: z.number()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: event.name,
            a: event.a,
            b: event.b,
            c: event.c
        },
    })

    const updateEvent = api.event.updateEvent.useMutation({
        async onSuccess(data) {
            toast(`Disciplína "${data.name} - ${formatSex(data.category, true)}" byla upraven.`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteEvent = api.event.deleteEvent.useMutation({
        async onSuccess(data) {
            toast(`Disciplína "${data.name} - ${formatSex(data.category, true)}" byla smazána.`)
            popEvent(data.id)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        updateEvent.mutate({
            id: event.id,
            ...values
        })
    }

    const onDelete = () => {
        deleteEvent.mutate({
            id: event.id
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jméno disciplíny</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište jméno disciplíny.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="a"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parametr A</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="Hodnota A" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište hodnotu parametru A.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="b"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parametr B</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="Hodnota B" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište hodnotu parametru B.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="c"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parametr C</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="Hodnota C" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište hodnotu parametru C.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <div className='flex flex-row gap-2 mt-8 mb-2'>
                        <Button type="submit">Updatovat</Button>
                        <DeleteConfirm onConfirm={onDelete}>
                            <Button variant="destructive">Vymazat</Button>
                        </DeleteConfirm>
                    </div>
                    <p className='text-sm text-muted-foreground'>Vzoreček: (a * (naměřená hodnota * koeficient - b) na c)</p>
                </div>

            </form>
        </Form>
    )
}

export default EventForm