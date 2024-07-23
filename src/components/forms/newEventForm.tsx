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
import { toast } from "sonner"
import { type PushDirection } from '../hooks/useArrayWithIdState'
import { api, type RouterOutputs } from '~/trpc/react'

function NewEventForm({race, pushEvents}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>, pushEvents: (element: NonNullable<RouterOutputs["event"]["createEvent"]>, direction?: PushDirection) => void}) {
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno disciplíny musí mít alespoň 1 znak.",
        }),
        category: z.string().min(1, {
            message: "Kategorie musí mít alespoň 1 znak.",
        }),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: ""
        },
    })

    const createEvent = api.event.createEvent.useMutation({
        async onSuccess(data) {
            toast(`Nová disciplína "${data.name}" pro kategorii "${data.category}" byla přidána .`)
            pushEvents(data)
            form.reset()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        createEvent.mutate({...values, raceId: race.id})
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jméno disciplíny</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno disciplíny" {...field} />
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
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jméno kategorie</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno kategorie" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište jméno kategorie.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Vytvořit disciplínu</Button>
            </form>
        </Form>
    )
}

export default NewEventForm