import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

interface Item {
    value: string,
    label: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RadioGroupInput<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({form, fieldName, label, items, onValueChange}: {form: UseFormReturn<TFieldValues, TContext, TTransformedValues>, fieldName: TName, label: string, items: Array<Item>, onValueChange?: ((event: string) => void)}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={(event) => {field.onChange(event); onValueChange && onValueChange(event)}}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                    >
                        {items.map((item, index) => (
                            <FormItem key={`radioGroup_${fieldName}_${index}`} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value={item.value} />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RadioGroupInput