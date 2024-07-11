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
import type { Race } from '~/server/types/race'
import type { EventPreview } from '~/server/types/event'
import { type PushDirection } from '../hooks/useArrayWithIdState'

function NewEventForm({race, pushEvents}: {race: Race, pushEvents: (element: EventPreview, direction?: PushDirection) => void}) {
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
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch('/api/event', {
            method: 'POST',
            body: JSON.stringify({
                ...values,
                raceId: race.id
            })
        })
        switch (response.status) {
            case 201: {
                toast(`Nová disciplína "${values.name}" pro kategorii "${values.category}" byla přidána .`)
                const data = (await response.json() as {data: EventPreview}).data
                pushEvents(data)
                form.reset()
                break
            }
            default: {
                toast("Někde se stala chyba, více informací v console.log().")
                console.log(response)
                break
            }
        }
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