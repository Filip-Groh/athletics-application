"use client"

import React from 'react'
import { PaginationButton } from '~/components/ui/pagination'

type PaginationPageButtonProps = {
    pageNumber: number
    currentPage: number
    setPage: (page: number) => void
}

const PaginationPageButton: React.FC<PaginationPageButtonProps> = ({ pageNumber, currentPage, setPage }) => {
    return (
        <PaginationButton isActive={pageNumber === currentPage} onClick={() => setPage(pageNumber)}>{pageNumber}</PaginationButton>
    )
}

export default PaginationPageButton