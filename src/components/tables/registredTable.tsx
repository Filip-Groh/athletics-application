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
import { formatSex } from "~/lib/utils"

type RegistredData = {
    name: string,
    surname: string,
    birthDate: Date,
    sex: string,
    club: string,
    eventCount: number
}

function RegistredTable({defaultData}: {defaultData: NonNullable<RouterOutputs["race"]["readRaceById"]>["racer"]}) {
    const data: RegistredData[] = defaultData.map((racer) => {
        return {
            name: racer.name,
            surname: racer.surname,
            birthDate: racer.birthDate,
            sex: racer.sex,
            club: racer.club,
            eventCount: racer.performace.length
        }
    })

    const columns: ColumnDef<RegistredData>[] = [
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
            accessorFn: (row) => {
                return formatSex(row.sex, false)
            }
        },
        {
            accessorKey: "club",
            header: "Oddíl",
        },
        {
            accessorKey: "eventCount",
            header: "Počet disciplín"
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