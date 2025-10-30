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
import { toast } from "sonner"
import { api, type RouterOutputs } from '~/trpc/react'
import { Checkbox } from '~/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import TextInput from '../fields/textInput'
import DatetimeInput from '../fields/datetimeInput'
import RadioGroupInput from '../fields/radioGroupInput'

function AnonymForm({raceId, events}: {raceId: number, events: NonNullable<RouterOutputs["race"]["getRaceEvents"]>}) {
    const router = useRouter()
    const utils = api.useUtils()

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno musí mít alespoň 1 znak.",
        }),
        surname: z.string().min(1, {
            message: "Příjmení musí mít alespoň 1 znak.",
        }),
        birthDate: z.date({
            required_error: "Musíte vybrat datum narození.",
        }),
        sex: z.enum(["man", "woman"], {
            required_error: "Vyberte pohlaví.",
        }),
        club: z.string().min(1, {
            message: "Jméno oddílu musí mít alespoň 1 znak.",
        }),
        event: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "Vyberte si alespoň 1 disciplínu.",
        })
    })

    const defaultValues = {
        name: "",
        surname: "",
        club: "",
        sex: "man" as const
    }
    
    const [selectedSex, setSelectedSex] = React.useState<string>(defaultValues.sex)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const createRacerWithFormData = api.racer.createRacerWithFormData.useMutation({
        async onSuccess(data) {
            toast(`Úspěšně jste se přihlásili na závod se startovním číslem ${data.startingNumber}.`)
            await utils.invalidate()
            router.push(`/zavod/${raceId}`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        }
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        createRacerWithFormData.mutate({
            raceId: raceId,
            name: values.name,
            surname: values.surname,
            birthDate: values.birthDate,
            sex: values.sex,
            club: values.club,
            event: values.event.filter((event) => events.some((e) => e.id.toString() === event && e.category === values.sex)).map((event) => {
                return Number(event)
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextInput form={form} fieldName="name" label="Jméno" placeholder="Jméno" description="Napište své jméno." />
                <TextInput form={form} fieldName="surname" label="Příjmení" placeholder="Příjmení" description="Napište své příjmení." />
                <DatetimeInput form={form} fieldName="birthDate" label="Datum narození" description="Vyberte datum narození." />
                <RadioGroupInput form={form} fieldName="sex" label="Zvolte pohlaví" onValueChange={setSelectedSex} items={[{value: "man", label: "Můž"}, {value: "woman", label: "Žena"}]} />
                <TextInput form={form} fieldName="club" label="Oddíl" placeholder="Oddíl" description="Napište oddíl, do kterého patřite." />
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
                                {events.map((event) => event.category === selectedSex ? (
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
                <Button type="submit">Přihlásit se</Button>
            </form>
        </Form>
    )
}

export default AnonymForm