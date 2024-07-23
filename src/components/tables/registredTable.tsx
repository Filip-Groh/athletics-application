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
import type { RouterOutputs } from "~/trpc/react"

function RegistredTable({data}: {data: NonNullable<RouterOutputs["race"]["readRaceById"]>["racer"]}) {
    const columns: ColumnDef<NonNullable<RouterOutputs["race"]["readRaceById"]>["racer"][0]>[] = [
        {
            accessorKey: "name",
            header: "Jméno",
        },
        {
            accessorKey: "surname",
            header: "Příjmení",
        },
        {
            accessorKey: "birthDate",
            header: "Datum narození",
            accessorFn: (row) => {
                return row.birthDate.toLocaleDateString()
            }
        },
        {
            accessorKey: "sex",
            header: "Pohlaví",
        },
        {
            accessorKey: "club",
            header: "Oddíl",
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

export default RegistredTable