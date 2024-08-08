import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inputStringToNumber(input: string) {
  return Number(input.replaceAll(" ", "").replaceAll(" ", "").replace(",", "."))
}
