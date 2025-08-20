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
import RadioGroupInput from './fields/radioGroupInput'

function NewEventForm() {
    const utils = api.useUtils()

    const createEvent = api.event.createEvent.useMutation({
        async onSuccess(data) {
            toast(`Nová skupina disciplín ${data.name ? `"${data.name}"` : ""} pro kategorii "${data.category}" byla přidána.`)
            await utils.event.getEvents.invalidate()
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
                category: "man"
            })
            createEvent.mutate({
                name: values.name,
                category: "woman"
            })
        } else {
            createEvent.mutate({
                name: values.name,
                category: values.category
            })            
        }
    }

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno skupiny disciplín musí mít alespoň 1 znak.",
        }),
        category: z.enum(["man", "woman", "both"], {
            required_error: "Vyberte kategorii.",
        })
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "both"
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextInput form={form} fieldName='name' label='Jméno skupiny disciplín' placeholder='Jméno skupiny disciplín' description='Napište jméno skupiny disciplín.' />
                <RadioGroupInput form={form} fieldName='category' label='Zvolte kategorii' items={[
                    {
                        value: "man",
                        label: "Muži"
                    },
                    {
                        value: "woman",
                        label: "Ženy"
                    },
                    {
                        value: "both",
                        label: "Obojí (Vytvořit 2, 1 pro muže a 1 pro ženy)"
                    }
                ]} />
                <Button type="submit" disabled={createEvent.isPending}>Vytvořit skupinu disciplín</Button>
            </form>
        </Form>
    )
}

export default NewEventForm