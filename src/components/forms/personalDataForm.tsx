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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { api } from '~/trpc/react'
import { cs } from 'date-fns/locale/cs'

function PersonalDataForm({personalInformation}: {personalInformation: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    surname: string;
    birthDate: Date;
    sex: "man" | "woman";
    club: string;
    userId: string | null;
} | null | undefined}) {
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
        })
    })

    const defaultValues = {
        name: personalInformation?.name ?? "",
        surname: personalInformation?.surname ?? "",
        birthDate: personalInformation?.birthDate,
        sex: personalInformation?.sex ?? "man",
        club: personalInformation?.club ?? ""
    }
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const setPersonalDataToUser = api.personalData.setPersonalDataToUser.useMutation({
        async onSuccess() {
            toast(`Úspěšně jste si nastavili osobní informace.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        }
    })

    const updatePersonalDataOfUser = api.personalData.updatePersonalDataOfUser.useMutation({
        async onSuccess() {
            toast(`Úspěšně jste si aktualizovali osobní informace.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        }
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (personalInformation) {
            updatePersonalDataOfUser.mutate({
                name: values.name,
                surname: values.surname,
                birthDate: values.birthDate,
                sex: values.sex,
                club: values.club
            })
        } else {
            setPersonalDataToUser.mutate({
                name: values.name,
                surname: values.surname,
                birthDate: values.birthDate,
                sex: values.sex,
                club: values.club
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
                            <FormLabel>Jméno</FormLabel>
                            <FormControl>
                                <Input placeholder="Jméno" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište své jméno.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Příjmení</FormLabel>
                            <FormControl>
                                <Input placeholder="Příjmení" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište své příjmení.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Datum narození</FormLabel>
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
                                    {field.value ? format(field.value, "PPP", {locale: cs}) : (<span>Vyberte datum</span>)}
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
                                    date > new Date()
                                }
                                initialFocus
                                locale={cs}
                                captionLayout='dropdown-buttons'
                                fromYear={1900}
                                toDate={new Date()}
                                classNames={{
                                    dropdown_year: "bg-red-500"
                                }}
                                // components={{
                                //     Dropdown: ({value, name, onChange}) => {
                                //         if (name === "years") {
                                //             const years = []
                                //             for (let year = 1900; year <= new Date().getFullYear(); year++) {
                                //                 years.push(year)
                                //             }
                                //             return (
                                //                 <Select defaultValue={value?.toString()}>
                                //                     <SelectTrigger className="w-[280px]">
                                //                         <SelectValue placeholder="Vyberte rok" />
                                //                     </SelectTrigger>
                                //                     <SelectContent>
                                //                         {years.map((year) => {
                                //                             return <SelectItem key={`years_${year}`} value={year.toString()}>{year}</SelectItem>
                                //                         })}
                                //                     </SelectContent>
                                //                 </Select>
                                //             )
                                //         } else {
                                //             return (
                                //                 <Select defaultValue={value?.toString()} value={value?.toString()} onOpenChange={handleChange}>
                                //                     <SelectTrigger className="w-[280px]">
                                //                         <SelectValue placeholder="Vyberte měsíc" />
                                //                     </SelectTrigger>
                                //                     <SelectContent>
                                //                         <SelectItem value="1">Leden</SelectItem>
                                //                         <SelectItem value="2">Únor</SelectItem>
                                //                         <SelectItem value="3">Březen</SelectItem>
                                //                         <SelectItem value="4">Duben</SelectItem>
                                //                         <SelectItem value="5">Květen</SelectItem>
                                //                         <SelectItem value="6">Červen</SelectItem>
                                //                         <SelectItem value="7">Červenec</SelectItem>
                                //                         <SelectItem value="8">Srpen</SelectItem>
                                //                         <SelectItem value="9">Září</SelectItem>
                                //                         <SelectItem value="10">Říjen</SelectItem>
                                //                         <SelectItem value="11">Listopad</SelectItem>
                                //                         <SelectItem value="12">Prosinec</SelectItem>
                                //                     </SelectContent>
                                //                 </Select>
                                //             )
                                //         }
                                //     }
                                // }}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Vyberte datum narození.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Zvolte pohlaví</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={(event) => {field.onChange(event)}}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="man" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Můž
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="woman" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Žena
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
                    name="club"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Oddíl</FormLabel>
                            <FormControl>
                                <Input placeholder="Oddíl" {...field} />
                            </FormControl>
                            <FormDescription>
                                Napište oddíl, do kterého patřite.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Uložit osobní údaje</Button>
            </form>
        </Form>
    )
}

export default PersonalDataForm