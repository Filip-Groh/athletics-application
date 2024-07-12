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

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Event } from '~/server/types/event'
import { RacePreview } from '~/server/types/race'
import { Checkbox } from "~/components/ui/checkbox"

function OverviewForm({race}: {race: RacePreview}) {
    const router = useRouter()
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        }),
        date: z.date({
            required_error: "Musíte vybrat datum.",
        }),
        place: z.string().min(1, {
            message: "Místo konání musí mít alespoň 1 znak.",
        }),
        organizer: z.string().min(1, {
            message: "Jméno organizátora musí mít alespoň 1 znak.",
        }),
        visible: z.boolean().default(false).optional()
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: race.name,
            date: race.date,
            place: race.place,
            organizer: race.organizer,
            visible: race.visible
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch('/api/race', {
            method: 'PATCH',
            body: JSON.stringify({id: race.id,...values})
        })
        switch (response.status) {
            case 200: {
                toast(`Závod "${values.name}" byl upraven.`)
                form.reset()
                const data = (await response.json() as {data: Event}).data
                router.push(`/zavody/${data.id}`)
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
                            <FormLabel>Jméno závodu</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište jméno závodu.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jméno organizátora</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno organizátora" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište jméno organizátora.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Místo konání</FormLabel>
                            <FormControl>
                                <Input placeholder="Místo konání" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište místo konání závodu.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Datum závodu</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call*/}
                                    {field.value ? format(field.value, "PPP") : (<span>Vyberte datum</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date < new Date()
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Vyberte datum konání závodu.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Viditelný závod
                            </FormLabel>
                            <FormDescription>
                            Pokud zaškrtnuto závodníci se můžou na závod přihlásit.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                />
                <Button type="submit">Updatovat</Button>
            </form>
        </Form>
    )
}

export default OverviewForm