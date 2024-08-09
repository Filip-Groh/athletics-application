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
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import React from 'react'
import type { MeasurementType, PerformanceType } from "~/app/zavody/[raceId]/performance"
import { Button } from "~/components/ui/button"
import { PlusIcon, Save } from "lucide-react"
import { useArrayState } from "~/components/hooks/useArrayState"
import { api } from "~/trpc/react"
import { toast } from "sonner"
import NumericInput from "../elements/numericInput"
import { formatSex, inputStringToNumber } from "~/lib/utils"

function Cell({performanceId, originalMeasurements, rowIndex}: {performanceId: number, originalMeasurements: MeasurementType[], rowIndex: number}) {
    const {push: pushMeasurement, state: measurements, change: changeMeasurement, set: setMeasurement} = useArrayState(originalMeasurements.map((measurement) => {
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

    return (
        <span className="flex flex-row gap-2">
            <Button variant="outline" size="icon" className="flex-shrink-0" onClick={handleSave}>
                <Save className="h-4 w-4" />
            </Button>
            {measurements.map((measurement, index) => {
                const handleChange = (newValue: string) => {
                    changeMeasurement(index, {id: measurement.id,value: newValue})
                }

                return <NumericInput key={`row_${rowIndex}_measurement_${index}`} placeholder="Hodnota" numericValue={measurement.value} onChange={handleChange} />
            })}
            <Button variant="outline" size="icon" className="flex-shrink-0" onClick={() => {pushMeasurement({id: undefined, value: ""})}}>
                <PlusIcon className="h-4 w-4" />
            </Button>
        </span>
    )
}

function PerformanceTable({data}: {data: PerformanceType[]}) {
    const columns: ColumnDef<PerformanceType>[] = [
        {
            accessorKey: "name",
            header: "Jméno",
        },
        {
            accessorKey: "surname",
            header: "Příjmení",
        },
        {
            accessorKey: "sex",
            header: "Pohlaví",
            accessorFn: (row) => {
                return formatSex(row.sex, false)
            }
        },
        {
            accessorKey: "birthDate",
            header: "Datum narození",
        },
        {
            accessorKey: "measurement",
            header: "Naměřeno",
            cell: ({ row }) => {
                return (<Cell performanceId={row.original.id} originalMeasurements={row.original.measurement} rowIndex={row.index}/>)
            }
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

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
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    )
}

export default PerformanceTable