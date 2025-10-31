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
import { Button } from "../ui/button"
import SortedIcon, { SortedIconType } from "../elements/sortedIcon"

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
    const utils = api.useUtils()

    const deleteRacer = api.racer.deleteRacer.useMutation({
        async onSuccess(deletedRacer) {
            toast(`Odhlásili jste závodníka "${deletedRacer.personalData.name} ${deletedRacer.personalData.surname}".`)
            popRacer(index)
            await utils.invalidate()
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

function RegistredTable({defaultData, isRaceManagerOrAbove}: {defaultData: NonNullable<RouterOutputs["race"]["readRaceById"]>["racer"], isRaceManagerOrAbove: boolean}) {
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: "startingNumber",
        desc: false
    }])

    const {state: racers, pop: popRacers} = useArrayState<RegistredData>(defaultData.map((racer) => {
        return {
            startingNumber: racer.startingNumber,
            name: racer.personalData.name,
            surname: racer.personalData.surname,
            birthDate: racer.personalData.birthDate,
            sex: racer.personalData.sex,
            club: racer.personalData.club,
            eventCount: racer.performace.length,
            options: {
                racerId: racer.id
            }
        }
    }))

    const popUpdateRacers = (index: number) => {
        popRacers(index)
        defaultData.splice(index, 1)
    }

    const columns: ColumnDef<RegistredData>[] = [
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
            accessorFn: (row) => {
                return row.birthDate.toLocaleDateString()
            },
            sortingFn: (rowA, rowB) => {
                return rowB.original.birthDate.valueOf() - rowA.original.birthDate.valueOf()
            },
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
            sortingFn: "alphanumeric"
        },
        {
            accessorKey: "eventCount",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Numbers} />
                            Počet disciplín
                        </Button>
                    </span>
                )
            },
        }
    ]

    if (isRaceManagerOrAbove) {
        columns.push({
            accessorKey: "options",
            header: "Možnosti",
            cell: ({ row }) => {
                return (<Cell racerId={row.original.options.racerId} index={row.index} popRacer={popUpdateRacers}/>)
            }
        })
    }

    const table = useReactTable({
        data: racers,
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