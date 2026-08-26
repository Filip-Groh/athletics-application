import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import React from "react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

interface SortableHeaderButtonProps<TData> {
    column: Column<TData, unknown>
    children: React.ReactNode
    className?: string
}

/**
 * Shared sortable table-header button used by all tables.
 * Renders the column title plus an asc/desc arrow reflecting
 * the current sort state; clicking toggles sorting.
 */
const SortableHeaderButton = <TData,>({ column, children, className }: SortableHeaderButtonProps<TData>) => {
    const sorted = column.getIsSorted()

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("-ml-2 h-8 px-2 lg:h-9", className)}
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {children}
            {sorted === "asc" ? (
                <ArrowUp className="ml-1 h-4 w-4" />
            ) : sorted === "desc" ? (
                <ArrowDown className="ml-1 h-4 w-4" />
            ) : null}
        </Button>
    )
}

export default SortableHeaderButton
