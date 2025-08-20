"use client"

import { type PersonalData } from '@prisma/client'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { formatSex } from '~/lib/utils'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { api, type RouterOutputs } from '~/trpc/react'
import { Checkbox } from '~/components/ui/checkbox'
import { useRouter } from 'next/navigation'

function AccontForm({sessionPersonalData, raceId, events}: {sessionPersonalData: PersonalData | null, raceId: number, events: NonNullable<RouterOutputs["race"]["getRaceEvents"]>}) {
    const router = useRouter()

    const formSchema = z.object({
        event: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "Vyberte si alespoň 1 disciplínu.",
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const createRacerWithUsersPersonalInformation = api.racer.createRacerWithUsersPersonalInformation.useMutation({
        async onSuccess(data) {
            toast(`Úspěšně jste se přihlásili na závod se startovním číslem ${data.startingNumber}.`)
            router.push(`/zavod/${raceId}`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createRacerWithUsersPersonalInformation.mutate({
            raceId: raceId,
            event: values.event.map((event) => {
                return Number(event)
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <p>Jméno: {sessionPersonalData?.name}</p>
                <p>Příjmení: {sessionPersonalData?.surname}</p>
                <p>Datum narození: {sessionPersonalData?.birthDate.toLocaleDateString()}</p>
                <p>Pohlaví: {formatSex(sessionPersonalData?.sex ?? "", false)}</p>
                <p>Oddíl: {sessionPersonalData?.club}</p>
                {events.length > 0 ? (
                    <FormField
                        control={form.control}
                        name="event"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Disciplíny</FormLabel>
                                    <FormDescription>
                                    Vyberte si disciplíny, ve kterých chcete soutěžit.
                                    </FormDescription>
                                </div>
                                {events.map((event) => event.category === sessionPersonalData?.sex ? (
                                    <FormField
                                        key={event.id.toString()}
                                        control={form.control}
                                        name="event"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={event.id.toString()}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(event.id.toString())}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value ? field.value : []), event.id.toString()])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== event.id.toString()
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {event.name ??  event.subEvent[0]?.name}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                    />
                                ) : null)}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : null}
                <Button type="submit">Zapsat se s uvedenými údaji</Button>
            </form>
        </Form>
    )
}

export default AccontForm