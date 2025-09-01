import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inputStringToNumber(input: string) {
  return input ? Number(input.replaceAll(" ", "").replaceAll(" ", "").replace(",", ".")) : NaN
}

export function formatSex(sex: string, plural: boolean) {
    switch (sex) {
        case "man":
            return plural ? "Muži" : "Muž"
        case "woman":
            return plural ? "Ženy" : "Žena"
        default:
            return ""
    }
}

export function downloadJSON(object: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(object, null, 4)], {
        type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
}