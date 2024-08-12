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
import { Checkbox } from "~/components/ui/checkbox"
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'
import DeleteConfirm from '../elements/deleteConfirm'

function OverviewForm({race}: {race: NonNullable<RouterOutputs["race"]["readRaceById"]>}) {
    const router = useRouter()
    
    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        }),
        date: z.date({
            required_error: "Musíte vybrat datum.",
        }),
        time: z.string().min(1, {
            message: "Musíte zvolit čas konání."
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
            time: race.date.toLocaleTimeString(navigator.language, {hour: "2-digit", minute: "2-digit"}),
            place: race.place,
            organizer: race.organizer,
            visible: race.visible
        },
    })

    const updateRace = api.race.updateRace.useMutation({
        async onSuccess(data) {
            toast(`Závod "${data.name}" byl upraven.`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteRace = api.race.deleteRace.useMutation({
        async onSuccess(data) {
            toast(`Závod "${data.name}" byl smazán.`)
            router.push(`/zavody`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const [hours, minutes] = values.time.split(":")
        values.date.setHours(Number(hours), Number(minutes))
        updateRace.mutate({ 
            id: race.id, 
            name: values.name,
            date: values.date,
            place: values.place,
            organizer: values.organizer,
            visible: values.visible
        })
    }

    const onDelete = () => {
        deleteRace.mutate({
            id: race.id
        })
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
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Čas konání</FormLabel>
                            <FormControl>
                                <Input type="time" placeholder="Čas konání" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište čas konání závodu.
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
                <div className='flex flex-row gap-2'>
                    <Button type="submit">Updatovat</Button>
                    <DeleteConfirm onConfirm={onDelete}>
                        <Button variant="destructive">Vymazat</Button>
                    </DeleteConfirm>
                </div>
            </form>
        </Form>
    )
}

export default OverviewForm