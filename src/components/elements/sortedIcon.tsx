import { type SortDirection } from '@tanstack/react-table'
import { ArrowDown, ArrowDown01, ArrowDownAZ, ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUp, ArrowUp01, ArrowUpAZ } from 'lucide-react'
import React from 'react'

export enum SortedIconType {
    Numbers,
    Letters,
    Bars,
    Plain
}

function SortedIcon({sorted, type, className="w-4 h-4"}: {sorted: false | SortDirection, type: SortedIconType, className?: string}) {
    if (!sorted) {
        return
    }

    switch (sorted) {
        case "asc":
            switch (type) {
                case SortedIconType.Numbers:
                    return <ArrowDown01 className={className} />
                case SortedIconType.Letters:
                    return <ArrowDownAZ className={className} />
                case SortedIconType.Bars:
                    return <ArrowDownNarrowWide className={className} />
                case SortedIconType.Plain:
                    return <ArrowDown className={className} />
            }
        case "desc":
            switch (type) {
                case SortedIconType.Numbers:
                    return <ArrowUp01 className={className} />
                case SortedIconType.Letters:
                    return <ArrowUpAZ className={className} />
                case SortedIconType.Bars:
                    return <ArrowDownWideNarrow className={className} />
                case SortedIconType.Plain:
                    return <ArrowUp className={className} />
            }
    }
}

export default SortedIcon