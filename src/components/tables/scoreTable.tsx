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
import { type ScoreData } from "~/app/prehled-zavodu/[raceId]/score"

function ScoreTable({data}: {data: ScoreData[]}) {
    const columns: ColumnDef<ScoreData>[] = [
        {
            accessorKey: "position",
            header: "Umístění",
            accessorFn: (row) => {
                return `${row.position + 1}.`
            }
        },
        {
            accessorKey: "name",
            header: "Jméno",
        },
        {
            accessorKey: "surname",
            header: "Příjmení",
        },
        {
            accessorKey: "age",
            header: "Věk",
            accessorFn: (row) => {
                const age = row.age
                switch (Math.abs(age)) {
                    case 1:
                        return `${age} rok`
                    case 2: case 3: case 4:
                        return `${age} roky`
                    default:
                        return `${age} let`
                }
            }
        },
        {
            accessorKey: "club",
            header: "Oddíl",
        },
        {
            accessorKey: "points",
            header: "Body",
        },
        {
            accessorKey: "bestMeasurement",
            header: "Nejlepší výkon",
        },
        {
            accessorKey: "measurements",
            header: "Výkony",
            accessorFn: (row) => {
                return row.measurements.map((measurement) => {
                    return measurement.toLocaleString()
                }).reduce((prev, curr) => {
                    return `${prev}; ${curr}`
                })
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
                        Žádné výsledky.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ScoreTable