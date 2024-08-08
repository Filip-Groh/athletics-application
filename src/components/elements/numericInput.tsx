import React from 'react'
import { Input } from "~/components/ui/input"
import { inputStringToNumber } from '~/lib/utils'

function NumericInput({numericValue, onChange, placeholder}: {numericValue: string | (() => string), onChange: (newValue: string) => void, placeholder: string}) {
    let value: string
    if (typeof numericValue === "string") {
        value = numericValue
    } else {
        console.log(typeof numericValue)
        value = numericValue()
    }

    return (
        <Input placeholder={placeholder} className={`${Number.isNaN(inputStringToNumber(value)) ? "border-destructive" : ""}`} value={value} onChange={(e) => {onChange(e.target.value)}} />
    )
}

export default NumericInput