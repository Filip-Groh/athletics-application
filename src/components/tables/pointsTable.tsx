"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import React from 'react'
import type { Data } from "~/app/zavody/[raceId]/points"
import { Button } from "../ui/button"
import { PlusIcon, Save, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import { useArrayState } from "../hooks/useArrayState"
import { api, type RouterOutputs } from "~/trpc/react"
import { toast } from "sonner"
import NumericInput from "../elements/numericInput"
import { inputStringToNumber } from "~/lib/utils"

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type EventNameCoeficientPair = {
    [eventName: string]: string
}

type DataInString = {
    age: string
} & EventNameCoeficientPair

function getIdentifier(age: string, eventId: number) {
    return `age:${age},event:${eventId}`
}

function InputCell({age, eventId, rowData}: {age: string, eventId: number, rowData: React.MutableRefObject<Map<string, string | undefined>>}) {
    const identifier = getIdentifier(age, eventId)
    const [value, setValue] = React.useState(rowData.current.get(identifier) ?? "0")

    React.useEffect(() => {
        rowData.current = rowData.current.set(identifier, value)
    }, [value, rowData, identifier])

    return (
        <NumericInput placeholder="Koeficient" numericValue={value} onChange={setValue} />
    )
}

function PointsTable({eventNames, defaultData}: {eventNames: {id: number, name: string}[], defaultData: Data[]}) {
    const {state: data, set: setData} = useArrayState(defaultData.map((item) => {
        // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
        const coeficients: DataInString = {
            age: item.age.toString()
        }
        eventNames.forEach((eventName) => {
            let coeficient = item[eventName.name]
            if (!coeficient) {
                coeficient = NaN
            }
            coeficients[eventName.name] = Number.isNaN(coeficient) ? "" : coeficient.toLocaleString()
        })
        return coeficients
    }))
    const {state: fields, change: changeFields} = useArrayState(eventNames.map((eventName) => {
        return {
            id: eventName.id,
            value: "1"
        }
    }))
    const rowData = React.useRef(new Map<string, string | undefined>())

    const nextAllowedAge = (startAge = 0, skip: number[] = []) => {
        while (true) {
            if (skip.includes(startAge) || data.some((value) => {
                return startAge.toString() === value.age
            })) {
                startAge++
            } else {
                break
            }
        }
        return startAge
    }
    const [age, setAge] = React.useState(nextAllowedAge())

    const addNewCoeficients = (ageCoeficients: NonNullable<RouterOutputs["ageCoeficient"]["addAgeCoeficients"]>) => {
        // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
        const uniqueAges = new Map<number, EventNameCoeficientPair>()
        ageCoeficients.forEach((ageCoeficient) => {
            if (uniqueAges.has(ageCoeficient.age)) {
                // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
                const ageLine = uniqueAges.get(ageCoeficient.age)!
                ageLine[ageCoeficient.event.name] = ageCoeficient.coeficient.toLocaleString()
                uniqueAges.set(ageCoeficient.age, ageLine)
            } else {
                // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
                const ageLine: EventNameCoeficientPair = {}
                ageLine[ageCoeficient.event.name] = ageCoeficient.coeficient.toLocaleString()
                uniqueAges.set(ageCoeficient.age, ageLine)
            }
        })

        uniqueAges.forEach((value, age) => {
            const dataBefore = data.filter((item) => {
                return inputStringToNumber(item.age) < age
            })
            const dataAfter = data.filter((item) => {
                return inputStringToNumber(item.age) > age
            })

            setData([...dataBefore, {
                age: age.toString(),
                ...value
            }, ...dataAfter])
        })
    }

    const saveAgeCoeficient = api.ageCoeficient.saveAgeCoeficient.useMutation({
        async onSuccess(ageCoeficients) {
            toast(`Úspěšně uloženo ${ageCoeficients.length} koeficientů.`)
            addNewCoeficients(ageCoeficients)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteAgeCoeficient = api.ageCoeficient.deleteAgeCoeficient.useMutation({
        async onSuccess(ageCoeficients) {
            toast(`Úspěšně smazáno ${ageCoeficients.length} koeficientů.`)
            const uniqueAges = new Set(ageCoeficients.map((ageCoeficient) => {
                return ageCoeficient.age.toLocaleString()
            }))
            setData(data.filter((item) => {
                return !uniqueAges.has(item.age)
            }))
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const eventColumns: ColumnDef<DataInString>[] = eventNames.map((eventName) => {
        return {
            accessorKey: eventName.name,
            header: eventName.name,
            cell: ({ row }) => {
                const identifier = getIdentifier(row.original.age, eventName.id)
                if (!rowData.current.has(identifier)) {
                    rowData.current = rowData.current.set(identifier, row.original[eventName.name])
                }

                return (
                    <InputCell age={row.original.age} eventId={eventName.id} rowData={rowData} />
                )
            }
        }
    })

    const columns: ColumnDef<DataInString>[] = [
        {
            accessorKey: "age",
            header: "Věk",
        },
        ...eventColumns,
        {
            accessorKey: "action",
            header: "Uložit / Smazat",
            cell: ({ row }) => {
                const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    e.preventDefault();
                    saveAgeCoeficient.mutate({
                        age: inputStringToNumber(row.original.age),
                        ageCoeficients: eventNames.map((eventName) => {
                            const coeficient = rowData.current.get(getIdentifier(row.original.age, eventName.id))
                            if (coeficient) {
                                return {
                                    eventId: eventName.id,
                                    coeficient: inputStringToNumber(coeficient)
                                }
                            }
                        }).filter((ageCoeficient) => {
                            return ageCoeficient !== undefined
                        })
                    })
                }

                const handleDelete = () => {
                    deleteAgeCoeficient.mutate({
                        age: inputStringToNumber(row.original.age),
                        eventIds: eventNames.map((eventName) => {
                            return eventName.id
                        })
                    })
                }

                return (
                    <div className="flex flex-row gap-2">
                        <Button variant="outline" size="icon" className="flex-shrink-0" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const addAgeCoeficients = api.ageCoeficient.addAgeCoeficients.useMutation({
        async onSuccess(newAgeCoeficients) {
            toast(`Úspěšně uloženo ${newAgeCoeficients.length}.`)
            addNewCoeficients(newAgeCoeficients)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addAgeCoeficients.mutate({
            age: age,
            ageCoeficients: fields.map((field) => {
                return {
                    eventId: field.id,
                    coeficient: inputStringToNumber(field.value)
                }
            })
        })
        fields.forEach((field) => {
            field.value = "1"
        })
        setAge(nextAllowedAge(age, [age]))
    }

    const isAgeInData = (age: number) => {
        return data.some((value) => {
            return age.toString() === value.age
        })
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        Žádné věkové koeficienty.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Input placeholder="Věk" type="number" className={`${isAgeInData(age) ? "border-destructive" : ""}`} value={age} onChange={(e) => {setAge(Math.round(Number(e.target.value)))}}/>
                        </TableCell>
                        {fields.map((field, index) => {
                            const handleChange = (newValue: string) => {
                                changeFields(index, {
                                    id: field.id,
                                    value: newValue
                                })
                            }

                            return (
                                <TableCell key={`tableFooter_${index}`}>
                                    <NumericInput placeholder="Koeficient" numericValue={field.value} onChange={handleChange} />
                                </TableCell>
                            )
                        })}
                        <TableCell>
                            <Button size="icon" onClick={handleSubmit}>
                                <PlusIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default PointsTable