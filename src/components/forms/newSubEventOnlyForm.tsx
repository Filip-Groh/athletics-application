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
import { inputStringToNumber } from '~/lib/utils'
import NumericInput from './fields/numericInput'

function NewSubEventOnlyForm() {
    const [category, setCategory] = React.useState("both")
    const utils = api.useUtils()

    const createEvent = api.subevent.createSubEventWithEvent.useMutation({
        async onSuccess(data) {
            toast(`Nová disciplína "${data.name}" pro kategorii "${data.category}" byla přidána.`)
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
                category: "man",
                a: inputStringToNumber(values.man_a),
                b: inputStringToNumber(values.man_b),
                c: inputStringToNumber(values.man_c)
            })
            createEvent.mutate({
                name: values.name,
                category: "woman",
                a: inputStringToNumber(values.woman_a),
                b: inputStringToNumber(values.woman_b),
                c: inputStringToNumber(values.woman_c)
            })
        } else {
            createEvent.mutate({
                name: values.name,
                category: values.category,
                a: inputStringToNumber(values.a),
                b: inputStringToNumber(values.b),
                c: inputStringToNumber(values.c)
            })            
        }
    }

    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Jméno disciplíny musí mít alespoň 1 znak.",
        }),
        category: z.enum(["man", "woman", "both"], {
            required_error: "Vyberte kategorii.",
        }),
        a: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        b: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        c: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        man_a: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        man_b: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        man_c: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        woman_a: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        woman_b: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        }),
        woman_c: z.string().min(1, {
            message: "Musíte zadat hodnotu."
        })
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "both",
            a: "1",
            b: "1",
            c: "1",
            man_a: "1",
            man_b: "1",
            man_c: "1",
            woman_a: "1",
            woman_b: "1",
            woman_c: "1"
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextInput form={form} fieldName='name' label='Jméno disciplíny' placeholder='Jméno disciplíny' description='Napište jméno disciplíny.' />
                <RadioGroupInput form={form} fieldName='category' label='Zvolte kategorii' onValueChange={setCategory} items={[
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
                {category === "both" ? <>
                    <div className='flex gap-2'>
                        <NumericInput form={form} fieldName='man_a' label='Parametr A pro muže' placeholder='Hodnota A' description='Napište hodnotu parametru A, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                        <NumericInput form={form} fieldName='woman_a' label='Parametr A pro ženy' placeholder='Hodnota A' description='Napište hodnotu parametru A, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                    </div>
                    <div className='flex gap-2'>
                        <NumericInput form={form} fieldName='man_b' label='Parametr B pro muže' placeholder='Hodnota B' description='Napište hodnotu parametru B, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                        <NumericInput form={form} fieldName='woman_b' label='Parametr B pro ženy' placeholder='Hodnota B' description='Napište hodnotu parametru B, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                    </div>
                    <div className='flex gap-2'>
                        <NumericInput form={form} fieldName='man_c' label='Parametr C pro muže' placeholder='Hodnota C' description='Napište hodnotu parametru C, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                        <NumericInput form={form} fieldName='woman_c' label='Parametr C pro ženy' placeholder='Hodnota C' description='Napište hodnotu parametru C, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                    </div>
                </> : <>
                    <NumericInput form={form} fieldName='a' label='Parametr A' placeholder='Hodnota A' description='Napište hodnotu parametru A, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                    <NumericInput form={form} fieldName='b' label='Parametr B' placeholder='Hodnota B' description='Napište hodnotu parametru B, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                    <NumericInput form={form} fieldName='c' label='Parametr C' placeholder='Hodnota C' description='Napište hodnotu parametru C, který se použije při výpočtu bodů. (a * ((naměřená hodnota * koeficient - b) na c))' />
                </>}
                <Button type="submit" disabled={createEvent.isPending}>Vytvořit disciplínu</Button>
            </form>
        </Form>
    )
}

export default NewSubEventOnlyForm