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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar"
import {
    User
} from "lucide-react"
import { toast } from "sonner"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import SortedIcon, { SortedIconType } from "../elements/sortedIcon"

function RoleCell({isSelected, userId, raceId}: {isSelected: boolean, userId: string, raceId: number}) {
    const [selected, setSelected] = React.useState(isSelected)

    const utils = api.useUtils()

    const setUserAdmin = api.user.setManagingRace.useMutation({
        onSuccess: async (data, variables) => {
            if (variables.isAssigned) {
                toast(`Uživatel ${data.name} se úspěšně stal zapisovatelem`)
            } else {
                toast(`Uživatel ${data.name} již není zapisovatel`)
            }

            await utils.invalidate()
        },
        onError: async (error) => {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        }
    })
    
    const handleUpdate = (checked: boolean) => {
        setSelected(checked)
        setUserAdmin.mutate({
            id: userId,
            raceId: raceId,
            isAssigned: checked
        })
    }

    return (
        <Switch checked={selected} onCheckedChange={handleUpdate} />
    )
}

function EventManagersTable({raceId, users}: {raceId: number, users: NonNullable<RouterOutputs["user"]["getEventManagers"]>}) {
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: "assigned",
        desc: false
    }])

    const columns: ColumnDef<NonNullable<RouterOutputs["user"]["getEventManagers"]>[0]>[] = [
        {
            accessorKey: "image",
            header: "Profilovka",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        {row.original.image ? <AvatarImage src={row.original.image} alt="@shadcn" /> : null}
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                )
            }
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
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Letters} />
                            E-Mail
                        </Button>
                    </span>
                )
            },
            sortingFn: "alphanumeric"
        },
        {
            accessorKey: "assigned",
            header: ({ column }) => {
                return (
                    <span className="flex flex-row gap-1 items-center">
                        <Button variant={"ghost"} onClick={() => {column.toggleSorting(column.getIsSorted() === "asc")}} className="flex flex-row gap-1">
                            <SortedIcon sorted={column.getIsSorted()} type={SortedIconType.Plain} />
                            Přiřazen
                        </Button>
                    </span>
                )
            },
            cell: ({row}) => {
                return <RoleCell isSelected={row.original.managingRaces.some((managingRace) => managingRace.id === raceId)} raceId={raceId} userId={row.original.id} />
            },
            sortingFn: (rowA, rowB) => {
                const isSelectedA = rowA.original.managingRaces.some((managingRace) => managingRace.id === raceId)
                const isSelectedB = rowB.original.managingRaces.some((managingRace) => managingRace.id === raceId)
                return (isSelectedB ? 1 : 0) - (isSelectedA ? 1 : 0)
            }
        }
    ]

    const table = useReactTable({
        data: users,
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
                        Žádní uživatelé s oprávněním.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    )
}

export default EventManagersTable