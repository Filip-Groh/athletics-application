import React from 'react'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form"
import { Input } from "~/components/ui/input"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextInput<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({form, fieldName, label, placeholder, description}: {form: UseFormReturn<TFieldValues, TContext, TTransformedValues>, fieldName: TName, label: string, placeholder: string, description: string}) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default TextInput