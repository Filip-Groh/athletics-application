import React from 'react'
import { Button } from "~/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { cs } from 'date-fns/locale/cs'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DatetimeInput<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({form, fieldName, label, description}: {form: UseFormReturn<TFieldValues, TContext, TTransformedValues>, fieldName: TName, label: string, description: string}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>{label}</FormLabel>
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
                <FormDescription>{description}</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default DatetimeInput