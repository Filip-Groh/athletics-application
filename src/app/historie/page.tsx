"use client"

import React from 'react'
import { api } from '~/trpc/react'
import QueryWrapper from '~/components/wrappers/QueryWrapper'
import PastRaceCards from '~/components/elements/pastRaceCards'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import PaginationPageButton from '~/components/elements/paginationPageButton'
import { getNumberOfPages } from '~/lib/utils'

const HistoryRacesPage = () => {
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)

    const getNumberOfPastRacesQuery = api.race.getNumberOfPastRaces.useQuery()

    return (
        <QueryWrapper
            query={getNumberOfPastRacesQuery}
            emptyPredicate={(data) => data === 0}
            Empty={<div>Žádné závody ještě neproběhly.</div>}
            Success={(data) => (
                <div>
                    <h2>Proběhlé závody</h2>
                    <PastRaceCards page={page} pageSize={pageSize} />
                    <div className="flex flex-row gap-4 items-center h-6 my-4">
                        <Select defaultValue='10' onValueChange={newValue => setPageSize(parseInt(newValue))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <Separator orientation='vertical' />
                        <Pagination className="mx-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setPage(prevPage => prevPage - 1)} disabled={page === 1} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationPageButton pageNumber={1} currentPage={page} setPage={setPage} />
                                </PaginationItem>
                                {page - 2 > 1 ?
                                    page - 2 === 2 ? (
                                        <PaginationItem>
                                            <PaginationPageButton pageNumber={page - 2} currentPage={page} setPage={setPage} />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                    : null}
                                {page - 1 > 1 ? (
                                    <PaginationItem>
                                        <PaginationPageButton pageNumber={page - 1} currentPage={page} setPage={setPage} />
                                    </PaginationItem>
                                ) : null}
                                {page > 1 && page < getNumberOfPages(data, pageSize) ? (
                                    <PaginationItem>
                                        <PaginationPageButton pageNumber={page} currentPage={page} setPage={setPage} />
                                    </PaginationItem>
                                ) : null}
                                {page + 1 < getNumberOfPages(data, pageSize) ? (
                                    <PaginationItem>
                                        <PaginationPageButton pageNumber={page + 1} currentPage={page} setPage={setPage} />
                                    </PaginationItem>
                                ) : null}
                                {page + 2 < getNumberOfPages(data, pageSize) ?
                                    page + 2 === getNumberOfPages(data, pageSize) - 1 ? (
                                        <PaginationItem>
                                            <PaginationPageButton pageNumber={page + 2} currentPage={page} setPage={setPage} />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                    : null}
                                {1 < getNumberOfPages(data, pageSize) ? (
                                    <PaginationItem>
                                        <PaginationPageButton pageNumber={getNumberOfPages(data, pageSize)} currentPage={page} setPage={setPage} />
                                    </PaginationItem>
                                ) : null}
                                <PaginationItem>
                                    <PaginationNext onClick={() => setPage(prevPage => prevPage + 1)} disabled={page >= getNumberOfPages(data, pageSize)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        />
    )
}

export default HistoryRacesPage