"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
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
import { type ScoreData } from "~/app/zavod/[raceId]/score"
import { Button } from "../ui/button"
import SortedIcon, { SortedIconType } from "../elements/sortedIcon"

function ScoreTable({data}: {data: ScoreData[]}) {
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: "position",
        desc: false
    }])

    const columns: ColumnDef<ScoreData>[] = [
        {
            accessorKey: "position",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Umístění
                        </Button>
                    </span>
                )
            },
            accessorFn: (row) => {
                return `${row.position + 1}.`
            }
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
            accessorKey: "orderNumber",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Startovací pořadí
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
        },
        {
            accessorKey: "age",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Věk
                        </Button>
                    </span>
                )
            },
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
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Letters} />
                            Oddíl
                        </Button>
                    </span>
                )
            },
        },
        {
            accessorKey: "points",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Body
                        </Button>
                    </span>
                )
            },
            accessorFn: (row) => {
                if (row.measurements.length === 0) {
                    return "-"
                }
                
                return Number.isNaN(row.points) ? 0 : row.points
            },
            sortingFn: (rowA, rowB) => {
                return rowA.original.points - rowB.original.points
            },
        },
        {
            accessorKey: "bestMeasurement",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Nejlepší výkon
                        </Button>
                    </span>
                )
            },
            accessorFn: (row) => {
                if (row.measurements.length === 0) {
                    return "-"
                }

                return row.bestMeasurement
            },
            sortingFn: (rowA, rowB) => {
                return rowA.original.points - rowB.original.points
            },
        },
        {
            accessorKey: "measurements",
            header: "Výkony",
            accessorFn: (row) => {
                return row.measurements.map((measurement) => {
                    return measurement.toLocaleString()
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
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting
        }
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

export default ScoreTable