import { type UseTRPCQueryResult } from "@trpc/react-query/shared"
import type { CoerceAsyncIterableToArray } from "./query"

export type ExtractDataTuple<T extends readonly unknown[]> = {
    [K in keyof T]: T[K] extends UseTRPCQueryResult<infer D, unknown> ? CoerceAsyncIterableToArray<D> : never
}

export type ExtractErrorTuple<T extends readonly unknown[]> = {
    [K in keyof T]: T[K] extends UseTRPCQueryResult<unknown, infer E> ? E : never
}