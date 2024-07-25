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
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import React from 'react'
import type { Data } from "~/app/zavody/[raceId]/points"
import { Button } from "../ui/button"
import { PlusIcon, Save } from "lucide-react"
import { Input } from "../ui/input"
import { useArrayState } from "../hooks/useArrayState"
import { api } from "~/trpc/react"
import { toast } from "sonner"

function PointsTable({eventNames, data}: {eventNames: {id: number, name: string}[], data: Data[]}) {
    const {state: fields, change: changeFields} = useArrayState(eventNames.map((eventName) => {
        return {
            id: eventName.id,
            value: 1
        }
    }))
    const [age, setAge] = React.useState(0)

    const eventColumns = eventNames.map((eventName) => {
        return {
            accessorKey: eventName.name,
            header: eventName.name
        }
    })

    const columns: ColumnDef<Data>[] = [
        {
            accessorKey: "age",
            header: "Věk",
        },
        ...eventColumns,
        {
            accessorKey: "action",
            header: "Uložit / Přidat",
            cell: ({ row }) => {
                return (<Save className="h-4 w-4" />)
            }
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const addAgeCoeficients = api.ageCoeficient.addAgeCoeficients.useMutation({
        async onSuccess(data) {
            toast(`Úspěšně uloženo ${data.length}.`)
        },
        async onError(error) {
            toast("Někde se stala chyba, více informací v console.log().")
            console.log(error)
        },
    })

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addAgeCoeficients.mutate({
            age: age,
            ageCoeficients: fields.map((field) => {
                return {
                    eventId: field.id,
                    coeficient: field.value
                }
            })
        })
        fields.forEach((field) => {
            field.value = 1
        })
        setAge(age + 1)
    }

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
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            <Input placeholder="Věk" type="number" value={age} onChange={(e) => {setAge(Number(e.target.value))}}/>
                        </TableCell>
                        {fields.map((field, index) => {
                            return (
                                <TableCell key={`tableFooter_${index}`}>
                                    <Input placeholder="Koeficient" value={field.value} onChange={(e) => {changeFields(index, {
                                        id: field.id,
                                        value: Number(e.target.value)
                                    })}}/>
                                </TableCell>
                            )
                        })}
                        <TableCell className="text-center">
                            <Button onClick={handleSubmit}>
                                <PlusIcon className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default PointsTable