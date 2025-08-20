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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar"
import {
    User
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { toast } from "sonner"

enum UserRole {
    Admin = 3,
    RaceManager = 2,
    EventManager = 1,
    Racer = 0
  }

function RoleCell({id, role}: {id: string, role: UserRole}) {
    const [selected, setSelected] = React.useState(role.toString())
    const [newValue, setNewValue] = React.useState(selected)
    const [alertOpen, setAlertOpen] = React.useState(false)

    async function onSuccess<T extends {role: number, name: string | null}>(newUser: T) {
        let newRole = "Racer"
        switch (newUser.role) {
            case 1:
                newRole = "Event Manager"
                break
            case 2:
                newRole = "Race Manager"
                break
            case 3:
                newRole = "Admin"
                break
            default:
                newRole = "Racer"
                break
        }
        toast(`Uživatel ${newUser.name} úspěšně obdržel novou roli ${newRole}`)
        setSelected(newValue)
    }

    async function onError(error: unknown) {
        toast("Někde se stala chyba, více informací v console.log().")
        console.log(error)
    }

    const setUserAdmin = api.user.setUserAdmin.useMutation({onSuccess, onError})
    const setUserRaceManager = api.user.setUserRaceManager.useMutation({onSuccess, onError})
    const setUserEventManager = api.user.setUserEventManager.useMutation({onSuccess, onError})
    const setUserRacer = api.user.setUserRacer.useMutation({onSuccess, onError})
    
    const handleUpdate = (newValue: string) => {
        setNewValue(newValue)
        setAlertOpen(true)
    }

    const onConfirm = () => {
        switch (newValue) {
            case "0":
                setUserRacer.mutate({id})
                break
            case "1":
                setUserEventManager.mutate({id})
                break
            case "2":
                setUserRaceManager.mutate({id})
                break
            case "3":
                setUserAdmin.mutate({id})
                break
        }
    }

    return (
        <>
            <Select defaultValue={role.toString()} value={selected} onValueChange={handleUpdate}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Racer</SelectItem>
                    <SelectItem value="1">Event Manager</SelectItem>
                    <SelectItem value="2">Race Manager</SelectItem>
                    <SelectItem value="3">Admin</SelectItem>
                </SelectContent>
            </Select>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Jste si jistí?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Přiřazujete práva uživatelům, jste si jistí, že jste vybrali správného uživatele a správné práva?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Ne, Zrušit</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirm}>Ano, Pokračovat</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    )
}

function UsersTable({users}: {users: NonNullable<RouterOutputs["user"]["getUsers"]>}) {
    const columns: ColumnDef<NonNullable<RouterOutputs["user"]["getUsers"]>[0]>[] = [
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
            header: "Jméno",
        },
        {
            accessorKey: "email",
            header: "E-Mail",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({row}) => {
                return <RoleCell id={row.original.id} role={row.original.role}/>
            }
        }
    ]

    const table = useReactTable({
        data: users,
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

export default UsersTable