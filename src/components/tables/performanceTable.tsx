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
import React, { useState } from 'react'
import { PerformanceType } from "~/app/zavody/[raceId]/performance"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useArrayState } from "../hooks/useArrayState"

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
        },
        {
            accessorKey: "birthDate",
            header: "Datum narození",
        },
        {
            accessorKey: "measurement",
            header: "Naměřeno",
            cell: ({ row }) => {
                const {push: pushMeasurement, state: measurements} = useArrayState(row.original.measurement)

                return (
                    <span className="flex flex-row gap-2">
                        {measurements.map((value) => {
                            const [valueState, setValueState] = React.useState(value)
                            
                            return (
                                <Input placeholder="Hodnota" value={valueState} onChange={(e) => {setValueState(Number(e.target.value))}} />
                            )
                        })}
                        <Button variant="outline" size="icon" onClick={() => {pushMeasurement(NaN)}}>
                            <PlusIcon className="h-4 w-4" />
                        </Button>
                    </span>
                )
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