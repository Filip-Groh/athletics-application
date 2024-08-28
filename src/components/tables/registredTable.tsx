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
import { api, type RouterOutputs } from "~/trpc/react"
import { formatSex } from "~/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useArrayState } from "../hooks/useArrayState"

type RegistredData = {
    startingNumber: number,
    name: string,
    surname: string,
    birthDate: Date,
    sex: string,
    club: string,
    eventCount: number,
    options: {
        racerId: number
    }
}

function Cell({racerId, index, popRacer}: {racerId: number, index: number, popRacer: (index: number) => void}) {
    const deleteRacer = api.racer.deleteRacer.useMutation({
        async onSuccess(deletedRacer) {
            toast(`Odhlásili jste závodníka "${deletedRacer.name} ${deletedRacer.surname}".`)
            popRacer(index)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleDelete = () => {
        deleteRacer.mutate({
            racerId: racerId
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
                    <span>Odhlásit závodníka</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function RegistredTable({defaultData}: {defaultData: NonNullable<RouterOutputs["race"]["readRaceById"]>["racer"]}) {
    const {state: racers, pop: popRacers} = useArrayState<RegistredData>(defaultData.map((racer) => {
        return {
            startingNumber: racer.startingNumber,
            name: racer.name,
            surname: racer.surname,
            birthDate: racer.birthDate,
            sex: racer.sex,
            club: racer.club,
            eventCount: racer.performace.length,
            options: {
                racerId: racer.id
            }
        }
    }))

    const columns: ColumnDef<RegistredData>[] = [
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
        },
        {
            accessorKey: "options",
            header: "Možnosti",
            cell: ({ row }) => {
                return (<Cell racerId={row.original.options.racerId} index={row.index} popRacer={popRacers}/>)
            }
        }
    ]

    const table = useReactTable({
        data: racers,
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
                        Žádní registrovaní závodníci.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    )
}

export default RegistredTable