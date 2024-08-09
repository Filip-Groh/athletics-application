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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

function NewEventForm({race, pushEvents}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>, pushEvents: (element: NonNullable<RouterOutputs["event"]["createEvent"]>, direction?: PushDirection) => void}) {
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno disciplíny musí mít alespoň 1 znak.",
        }),
        category: z.enum(["man", "woman", "both"], {
            required_error: "Vyberte kategorii.",
        }),
        a: z.string(),
        b: z.string(),
        c: z.string()
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "both",
            a: "1",
            b: "1",
            c: "1"
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
        if (values.category === "both") {
            createEvent.mutate({
                name: values.name,
                category: "man",
                raceId: race.id,
                a: Number(values.a),
                b: Number(values.b),
                c: Number(values.c)
            })
            createEvent.mutate({
                name: values.name,
                category: "woman",
                raceId: race.id,
                a: Number(values.a),
                b: Number(values.b),
                c: Number(values.c)
            })
        } else {
            createEvent.mutate({
                name: values.name,
                category: values.category,
                raceId: race.id,
                a: Number(values.a),
                b: Number(values.b),
                c: Number(values.c)
            })            
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
                        <FormItem className="space-y-3">
                        <FormLabel>Zvolte kategorii</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="man" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Muži
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="woman" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Ženy
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="both" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Obojí (Vytvořit 2, 1 pro muže a 1 pro ženy)
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
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
                                Napište hodnotu parametru A, který se použije při výpočtu bodů.<br />(a * (naměřená hodnota * koeficient - b) na c)
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
                                Napište hodnotu parametru B, který se použije při výpočtu bodů.<br />(a * (naměřená hodnota * koeficient - b) na c)
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
                                Napište hodnotu parametru C, který se použije při výpočtu bodů.<br />(a * (naměřená hodnota * koeficient - b) na c)
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