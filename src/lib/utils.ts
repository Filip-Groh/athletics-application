import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inputStringToNumber(input: string) {
  return Number(input.replaceAll(" ", "").replaceAll(" ", "").replace(",", "."))
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
