"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    type SortingState,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import React from 'react'
import type { MeasurementType, PerformanceType } from "~/app/zavod/[raceId]/admin/performance"
import { Button } from "~/components/ui/button"
import { PlusIcon, Save, EllipsisVertical, Trash2, Shuffle } from "lucide-react"
import { useArrayState } from "~/components/hooks/useArrayState"
import { api } from "~/trpc/react"
import { toast } from "sonner"
import NumericInput from "../elements/numericInput"
import { formatSex, inputStringToNumber } from "~/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import SortedIcon, { SortedIconType } from "../elements/sortedIcon"

function MeasurementCell({performanceId, originalMeasurements, rowIndex}: {performanceId: number, originalMeasurements: MeasurementType[], rowIndex: number}) {
    const utils = api.useUtils()

    const [allowSave, setAllowSave] = React.useState(false)
    const {push: pushMeasurement, state: measurements, change: changeMeasurement, set: setMeasurement, pop: popMeasurement} = useArrayState(originalMeasurements.map((measurement) => {
        return {
            id: measurement.id,
            value: Number.isNaN(measurement.value) ? "" : measurement.value.toLocaleString()
        }
    }))

    const saveMeasurements = api.measurement.saveMeasurementsOnPerformance.useMutation({
        async onSuccess(measurements) {
            toast(`Úspěšně uloženo ${measurements.length} měření.`)

            setMeasurement(measurements.map((measurement) => {
                if (!measurement.value) {
                    measurement.value = NaN
                }
                return {
                    id: measurement.id,
                    value:  Number.isNaN(measurement.value) ? "" : measurement.value.toLocaleString()
                }
            }))
            await utils.race.readRaceById.invalidate()
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const deleteMeasurement = api.measurement.deleteMeasurement.useMutation({
        async onSuccess(measurement) {
            popMeasurement(measurement.index)
            await utils.race.readRaceById.invalidate()
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        saveMeasurements.mutate({
            performanceId: performanceId,
            measurements: measurements.map((measurement) => {
                return {
                    id: measurement.id,
                    value: inputStringToNumber(measurement.value)
                }
            })
        })
    }

    React.useEffect(() => {
        const originalMeasurementsMap = new Map<number, string>()
        originalMeasurements.forEach((measurement) => {
            originalMeasurementsMap.set(measurement.id!, Number.isNaN(measurement.value) ? "" : measurement.value.toLocaleString())
        })

        for (const measurement of measurements) {
            if (measurement.id === undefined) {
                setAllowSave(true)
                return
            }

            const original = originalMeasurementsMap.get(measurement.id)

            if (original === undefined || measurement.value !== original) {
                setAllowSave(true)
                return
            }
        }

        setAllowSave(false)
    }, [measurements, originalMeasurements])

    return (
        <span className="flex flex-row gap-2">
            {measurements.length > 0 ? (
                <Button variant="outline" size="icon" className="flex-shrink-0" onClick={handleSave} disabled={!allowSave}>
                    <Save className="h-4 w-4" />
                </Button>
            ) : null}

            {measurements.map((measurement, index) => {
                const handleChange = (newValue: string) => {
                    changeMeasurement(index, {id: measurement.id,value: newValue})
                }

                const handleDelete = () => {
                    if (!measurement.id) {
                        popMeasurement(index)
                    } else {
                        deleteMeasurement.mutate({
                            id: measurement.id,
                            index: index
                        })
                    }
                }

                return (
                    <NumericInput key={`row_${rowIndex}_measurement_${index}`} placeholder="Hodnota" allowEmpty numericValue={measurement.value} onChange={handleChange} onDelete={handleDelete} />
                )
            })}
            <Button variant="outline" size="icon" className="flex-shrink-0" onClick={() => {pushMeasurement({id: undefined, value: ""})}}>
                <PlusIcon className="h-4 w-4" />
            </Button>
        </span>
    )
}

function OptionsCell({raceId, racerId, eventId}: {raceId: number, racerId: number, eventId: number}) {
    const utils = api.useUtils()

    const disconnectRacer = api.racer.disconnectRacer.useMutation({
        async onSuccess(disconnectRacer) {
            toast(`Odhlásili jste závodníka "${disconnectRacer.racer?.personalData.name} ${disconnectRacer.racer?.personalData.surname}" z ${disconnectRacer.subEventCount} disciplín.`)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleDelete = () => {
        disconnectRacer.mutate({
            raceId: raceId,
            racerId: racerId,
            eventId: eventId
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Možnosti</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Odhlásit závodníka z disciplíny</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function PerformanceTable({performance, isRaceManagerOrAbove}: {performance: PerformanceType[], isRaceManagerOrAbove: boolean}) {
    const utils = api.useUtils()

    const [sorting, setSorting] = React.useState<SortingState>([{
        id: "orderNumber",
        desc: false
    }])

    const columns: ColumnDef<PerformanceType>[] = [
        {
            accessorKey: "orderNumber",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Startovací Pořadí
                        </Button>
                        <Button variant={"ghost"} size={"icon"} onClick={handleShuffle}>
                            <Shuffle className="h-4 w-4" />
                        </Button>
                    </span>
                    
                )
            },
            accessorFn: (row) => {
                return `${row.orderNumber}.`
            },
        },
        {
            accessorKey: "startingNumber",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Startovní číslo
                        </Button>
                    </span>
                )
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Letters} />
                            Jméno
                        </Button>
                    </span>
                )
            },
            sortingFn: "alphanumeric"
        },
        {
            accessorKey: "surname",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Letters} />
                            Příjmení
                        </Button>
                    </span>
                )
            },
            sortingFn: "alphanumeric"
        },
        {
            accessorKey: "sex",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Letters} />
                            Pohlaví
                        </Button>
                    </span>
                )
            },
            accessorFn: (row) => {
                return formatSex(row.sex, false)
            },
            sortingFn: "alphanumeric"
        },
        {
            accessorKey: "birthDate",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Datum narození
                        </Button>
                    </span>
                )
            },
            sortingFn: (rowA, rowB) => {
                const splitedA = rowA.original.birthDate.split(".")
                const splitedB = rowB.original.birthDate.split(".")
                const dateA = Date.UTC(parseInt(splitedA[2]!), parseInt(splitedA[1]!) - 1, parseInt(splitedA[0]!))
                const dateB = Date.UTC(parseInt(splitedB[2]!), parseInt(splitedB[1]!) - 1, parseInt(splitedB[0]!))
                return dateB.valueOf() - dateA.valueOf()
            },
        },
        {
            accessorKey: "measurement",
            header: "Naměřeno",
            cell: ({ row }) => {
                return (<MeasurementCell performanceId={row.original.id} originalMeasurements={row.original.measurement} rowIndex={row.index}/>)
            }
        }
    ]

    if (isRaceManagerOrAbove) {
        columns.push({
            accessorKey: "options",
            header: "Možnosti",
            cell: ({row}) => {
                return (<OptionsCell raceId={row.original.options.raceId} racerId={row.original.options.racerId} eventId={row.original.options.eventId} />)
            }
        })
    }

    const table = useReactTable({
        data: performance,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        }
    })

    const changeRacersOrderNumber = api.racer.changeRacersOrderNumber.useMutation({
        async onSuccess(changeRacersOrderNumber) {
            console.log(changeRacersOrderNumber)
            await utils.invalidate()
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleShuffle = () => {
        const orderNumbers = performance.map((item) => {
            return item.orderNumber
        })
        const orderNumbersShuffled: number[] = []
        const orderNumberLength = orderNumbers.length
        for (let i = 0; i < orderNumberLength; i++) {
            const selected = Math.floor(Math.random() * orderNumbers.length)
            orderNumbersShuffled.push(orderNumbers[selected]!)
            orderNumbers.splice(selected, 1)
        }
        const newPerformance = performance.map((item, index) => {
            item.orderNumber = orderNumbersShuffled[index]!
            return item
        })
        changeRacersOrderNumber.mutate(newPerformance.map((item) => {
            return {
                performanceId: item.id,
                newOrderNumber: item.orderNumber
            }
        }))
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
                        Žádní zapsaní závodníci.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>    
    )
}

export default PerformanceTable