import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type RouterOutputs } from "~/trpc/react"
import type { Dataset, Data } from "~/types/event"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const inputStringToNumber = (input: string) => {
  return input ? Number(input.replaceAll(" ", "").replaceAll(" ", "").replace(",", ".")) : NaN
}

export const formatSex = (sex: string, plural: boolean) => {
    switch (sex) {
        case "man":
            return plural ? "Muži" : "Muž"
        case "woman":
            return plural ? "Ženy" : "Žena"
        default:
            return ""
    }
}

export const downloadJSON = (object: unknown, filename: string) => {
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

export const getNumberOfPages = (numberOfElements: number, pageSize: number) => {
    return Math.ceil((numberOfElements) / pageSize)
}

export const getEventCategories = (event: NonNullable<RouterOutputs["event"]["getEventsWithAgeCoeficients"]>[0]) => {
    if (event.name) {
        return `${event.name} - ${formatSex(event.category, true)}`
    }
    return formatSex(event.category, true)
}

export const createDataset = (events: RouterOutputs["event"]["getEventsWithAgeCoeficients"]) => {
    const dataset: Dataset = {}

    const eventCategories = Array.from(new Set(events.map((event) => {
        return getEventCategories(event)
    })))

    const eventCategoriesToAgeMap = new Map<string, number[]>()
    const eventCategoriesToSubEventNameMap = new Map<string, { id: number, name: string }[]>()
    events.forEach((event) => {
        event.subEvent.forEach((subEvent) => {
            const currentAges = eventCategoriesToAgeMap.get(getEventCategories(event))
            const currentSubEventNames = eventCategoriesToSubEventNameMap.get(getEventCategories(event))
            const ages = subEvent.ageCoeficient.map((ageCoeficient) => {
                return ageCoeficient.age
            })

            if (currentAges) {
                ages.forEach((age) => {
                    const include = currentAges.some((currentAge) => {
                        return age === currentAge
                    })
                    if (!include) {
                        currentAges.push(age)
                    }
                })
                eventCategoriesToAgeMap.set(getEventCategories(event), currentAges)
            } else {
                eventCategoriesToAgeMap.set(getEventCategories(event), ages)
            }

            if (currentSubEventNames) {
                const include = currentSubEventNames.some((currentSubEventName) => {
                    return subEvent.id === currentSubEventName.id
                })
                if (!include) {
                    currentSubEventNames.push({
                        id: subEvent.id,
                        name: subEvent.name
                    })
                }
                eventCategoriesToSubEventNameMap.set(getEventCategories(event), currentSubEventNames)
            } else {
                eventCategoriesToSubEventNameMap.set(getEventCategories(event), [{
                    id: subEvent.id,
                    name: subEvent.name
                }])
            }
        })
    })

    eventCategories.forEach((eventCategory) => {
        const ages = eventCategoriesToAgeMap.get(eventCategory)
        const subEventNames = eventCategoriesToSubEventNameMap.get(eventCategory)

        if (ages) {
            dataset[eventCategory] = ages.map((age) => {
                const returnData: Data = {
                    age: age
                }
                if (!subEventNames) {
                    return returnData
                }

                subEventNames.forEach((subEventName) => {
                    for (const event of events) {
                        subEventsLoop: for (const subEvent of event.subEvent) {
                            if (getEventCategories(event) !== eventCategory || subEvent.id !== subEventName.id) {
                                continue
                            }

                            for (const ageCoeficient of subEvent.ageCoeficient) {
                                if (ageCoeficient.age !== age) {
                                    continue
                                }

                                returnData[subEventName.name] = ageCoeficient.coeficient
                                break subEventsLoop
                            }
                        }
                    }
                })
                return returnData
            })
        } else {
            dataset[eventCategory] = []
        }
    })

    return {
        dataset,
        eventCategories,
        eventCategoriesToSubEventNameMap
    }
}