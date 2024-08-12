import React from 'react'
import { Input } from "~/components/ui/input"
import { inputStringToNumber } from '~/lib/utils'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'

function NumericInput({numericValue, onChange, placeholder, className, onDelete}: {numericValue: string | (() => string), onChange: (newValue: string) => void, placeholder: string, className?: string, onDelete?: () => void}) {
    let value: string
    if (typeof numericValue === "string") {
        value = numericValue
    } else {
        console.log(typeof numericValue)
        value = numericValue()
    }

    if (onDelete) {
        return (
            <div className="flex w-full max-w-sm items-center">
                <Input placeholder={placeholder} className={`${Number.isNaN(inputStringToNumber(value)) ? "border-destructive" : ""} rounded-r-none border-collapse z-10 ${className}`} value={value} onChange={(e) => {onChange(e.target.value)}} />
                <Button variant="outline" size="icon" className={`${Number.isNaN(inputStringToNumber(value)) ? "border-destructive" : ""} rounded-l-none border-l-0`} onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Input placeholder={placeholder} className={`${Number.isNaN(inputStringToNumber(value)) ? "border-destructive" : ""} ${className}`} value={value} onChange={(e) => {onChange(e.target.value)}} />
    )
}

export default NumericInput