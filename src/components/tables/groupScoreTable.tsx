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
import { type GroupScoreData } from "~/app/zavod/[raceId]/score"

function GroupScoreTable({data}: {data: GroupScoreData[]}) {
    const columns: ColumnDef<GroupScoreData>[] = [
        {
            accessorKey: "position",
            header: "Umístění",
            accessorFn: (row) => {
                return `${row.position + 1}.`
            }
        },
        {
            accessorKey: "startingNumber",
            header: "Startovací číslo"
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
            accessorFn: (row) => {
                return Number.isNaN(row.points) ? 0 : row.points
            }
        },
        {
            accessorKey: "subEventPoints",
            header: "Body v disciplínách",
            accessorFn: (row) => {
                return row.subEventPoints.map((points) => {
                    return points.toLocaleString()
                }).reduce((prev, curr) => {
                    if (prev === "") {
                        return `${curr}`
                    }
                    return `${prev}; ${curr}`
                }, "")
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
                        data-highlight={row.original.isMe && "highlighted"}
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

export default GroupScoreTable