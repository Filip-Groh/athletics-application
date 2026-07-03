import { type UseTRPCQueryResult } from '@trpc/react-query/shared'
import React from 'react'
import type { MinimalError, CoerceAsyncIterableToArray } from '~/types/query'
import type { ExtractDataTuple, ExtractErrorTuple } from '~/types/tuple'

type CommonLoadingProps = {
    loadingPredicate?: never
    Loading?: never
} | {
    loadingPredicate?: never
    Loading: React.ReactNode | React.FC
}

type SingleLoadingProps<TData, TError> = CommonLoadingProps | {
    loadingPredicate: (query: UseTRPCQueryResult<TData, TError>) => boolean
    Loading: React.ReactNode | React.FC
}

type MultiLoadingProps<TQueries extends readonly unknown[]> = CommonLoadingProps | {
    loadingPredicate: (queries: readonly [...TQueries]) => boolean
    Loading: React.ReactNode | React.FC
}

type CommonErrorProps<TErrorNode> = {
    errorPredicate?: never
    Error?: never
} | {
    errorPredicate?: never
    Error: TErrorNode
}

type SingleErrorProps<TData, TError, TErrorNode> = CommonErrorProps<TErrorNode> | {
    errorPredicate: (query: UseTRPCQueryResult<TData, TError>) => boolean
    Error: TErrorNode
}

type MultiErrorProps<TQueries extends readonly unknown[], TErrorNode> = CommonErrorProps<TErrorNode> | {
    errorPredicate: (queries: readonly [...TQueries]) => boolean
    Error: TErrorNode
}

type CommonEmptyProps<TData> = {
    emptyPredicate?: never
    Empty?: never
} | {
    emptyPredicate?: never
    Empty: React.ReactNode | React.FC
} | {
    emptyPredicate: (data: TData) => boolean
    Empty: React.ReactNode | React.FC
}

type CommonSuccessProps<TSuccessData> = {
    successPredicate?: never
    Success: React.FC<TSuccessData>
}

type SingleSuccessProps<TData, TError, TSuccessData> = CommonSuccessProps<TSuccessData> | {
    successPredicate: (query: UseTRPCQueryResult<TData, TError>) => boolean
    Success: React.FC<TSuccessData>
}

type MultiSuccessProps<TQueries extends readonly unknown[], TSuccessData> = CommonSuccessProps<TSuccessData> | {
    successPredicate: (queries: readonly [...TQueries]) => boolean
    Success: React.FC<TSuccessData>
}

type SingleBaseProps<TData, TError> = SingleLoadingProps<TData, TError> & SingleErrorProps<TData, TError, React.FC<TError>> & {
    query: UseTRPCQueryResult<TData, TError>
}

type MultiBaseProps<TQueries extends readonly unknown[]> = MultiLoadingProps<TQueries> & MultiErrorProps<TQueries, React.FC<ExtractErrorTuple<TQueries>>> & {
    queries: readonly [...TQueries]
}

type SingleStandardProps<TData, TError> = SingleBaseProps<TData, TError> & CommonEmptyProps<CoerceAsyncIterableToArray<TData>> & SingleSuccessProps<TData, TError, CoerceAsyncIterableToArray<TData>> & {
    transform?: never
}

type SingleTransformedProps<TData, TError, TTransformedData> = SingleBaseProps<TData, TError> & CommonEmptyProps<TTransformedData> & SingleSuccessProps<TData, TError, TTransformedData> & {
    transform: (data: CoerceAsyncIterableToArray<TData>) => TTransformedData
}

type MultiStandardProps<TQueries extends readonly unknown[]> = MultiBaseProps<TQueries> & CommonEmptyProps<ExtractDataTuple<TQueries>> & MultiSuccessProps<TQueries, ExtractDataTuple<TQueries>> & {
    transform?: never
}

type MultiTransformedProps<TQueries extends readonly unknown[], TTransformedData> = MultiBaseProps<TQueries> & CommonEmptyProps<TTransformedData> & MultiSuccessProps<TQueries, TTransformedData> & {
    transform: (data: ExtractDataTuple<TQueries>) => TTransformedData
}

function QueryWrapper<TData, TError extends MinimalError, TTransformedData>(props: SingleTransformedProps<TData, TError, TTransformedData>): React.ReactElement | null
function QueryWrapper<TData, TError extends MinimalError>(props: SingleStandardProps<TData, TError>): React.ReactElement | null
function QueryWrapper<TQueries extends readonly [object, ...object[]], TTransformedData>(props: MultiTransformedProps<TQueries, TTransformedData>): React.ReactElement | null
function QueryWrapper<TQueries extends readonly [object, ...object[]]>(props: MultiStandardProps<TQueries>): React.ReactElement | null
function QueryWrapper<TData, TError extends MinimalError, TQueries extends readonly unknown[], TTransformedData>(
    props: SingleStandardProps<TData, TError> | SingleTransformedProps<TData, TError, TTransformedData> | MultiStandardProps<TQueries> | MultiTransformedProps<TQueries, TTransformedData>
) {
    if ('queries' in props) {
        return renderMultiQuery<TQueries, TTransformedData>(
            props as MultiStandardProps<TQueries> | MultiTransformedProps<TQueries, TTransformedData>
        )
    }

    return renderSingleQuery<TData, TError, TTransformedData>(
        props as SingleStandardProps<TData, TError> | SingleTransformedProps<TData, TError, TTransformedData>
    )
}

const defaultSingleIsLoadingPredicate = <TData, TError>(query: UseTRPCQueryResult<TData, TError>): boolean => {
    return query.isLoading
}

const defaultSingleIsErrorPredicate = <TData, TError>(query: UseTRPCQueryResult<TData, TError>): boolean => {
    return query.isError
}

const defaultSingleIsSuccessPredicate = <TData, TError>(query: UseTRPCQueryResult<TData, TError>): boolean => {
    return query.isSuccess
}

const defaultMultiIsLoadingPredicate = <TQueries extends readonly unknown[]>(queries: readonly [...TQueries]): boolean => {
    return queries.some((q) => (q as UseTRPCQueryResult<unknown, unknown>).isLoading)
}

const defaultMultiIsErrorPredicate = <TQueries extends readonly unknown[]>(queries: readonly [...TQueries]): boolean => {
    return queries.some((q) => (q as UseTRPCQueryResult<unknown, unknown>).isError)
}

const defaultMultiIsSuccessPredicate = <TQueries extends readonly unknown[]>(queries: readonly [...TQueries]): boolean => {
    return queries.every((q) => (q as UseTRPCQueryResult<unknown, unknown>).isSuccess)
}

const defaultIsEmptyPredicate = <TData,>(data: TData): boolean => {
    return data === null || data === undefined || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)
}

const DefaultLoading = () => {
    return <div>Loading ...</div>
}

const DefaultSingleError = <TError extends MinimalError>(error: TError) => {
    return <div>Nastala chyba: {error.message}</div>
}

const DefaultMultiError = <TError extends MinimalError>(errors: TError[]) => {
    if (errors.length === 1) {
        return <div>Nastala chyba: {errors[0]!.message}</div>
    }

    return <div>Nastaly chyby: {errors.map((e) => e.message).join(', ')}</div>
}

const renderSingleQuery = <TData, TError extends MinimalError, TTransformedData>(props: SingleStandardProps<TData, TError> | SingleTransformedProps<TData, TError, TTransformedData>) => {
    if (props.loadingPredicate ? props.loadingPredicate(props.query) : defaultSingleIsLoadingPredicate(props.query)) {
        return props.Loading ?? DefaultLoading()
    }

    if (props.errorPredicate ? props.errorPredicate(props.query) : defaultSingleIsErrorPredicate(props.query)) {
        return props.Error ? props.Error(props.query.error!) : DefaultSingleError(props.query.error!)
    }

    if (props.successPredicate ? props.successPredicate(props.query) : defaultSingleIsSuccessPredicate(props.query)) {
        const cleanData = props.query.data as CoerceAsyncIterableToArray<TData>

        if ('transform' in props && props.transform) {
            const transformedData = props.transform(cleanData)

            if (props.Empty && (props.emptyPredicate ? props.emptyPredicate(transformedData) : defaultIsEmptyPredicate(transformedData))) {
                return props.Empty
            }

            return props.Success(transformedData)
        }

        if (props.Empty && (props.emptyPredicate ? props.emptyPredicate(cleanData) : defaultIsEmptyPredicate(cleanData))) {
            return props.Empty
        }

        return props.Success(cleanData)
    }

    return null
}

const renderMultiQuery = <TQueries extends readonly unknown[], TTransformedData>(props: MultiStandardProps<TQueries> | MultiTransformedProps<TQueries, TTransformedData>) => {
    if (props.loadingPredicate ? props.loadingPredicate(props.queries) : defaultMultiIsLoadingPredicate(props.queries)) {
        return props.Loading ?? DefaultLoading()
    }

    if (props.errorPredicate ? props.errorPredicate(props.queries) : defaultMultiIsErrorPredicate(props.queries)) {
        const queryErrors = props.queries.flatMap((q) => ((q as UseTRPCQueryResult<unknown, unknown>).error ? [(q as UseTRPCQueryResult<unknown, unknown>).error] : [])) as unknown as ExtractErrorTuple<TQueries>
        return props.Error ? props.Error(queryErrors) : DefaultMultiError(props.queries.map((q) => (q as UseTRPCQueryResult<unknown, unknown>).error!).filter(Boolean) as unknown as MinimalError[])
    }

    if (props.successPredicate ? props.successPredicate(props.queries) : defaultMultiIsSuccessPredicate(props.queries)) {
        const cleanData = props.queries.map((q) => (q as UseTRPCQueryResult<unknown, unknown>).data) as unknown as ExtractDataTuple<TQueries>

        if ('transform' in props && props.transform) {
            const transformedData = props.transform(cleanData)

            if (props.Empty && (props.emptyPredicate ? props.emptyPredicate(transformedData) : defaultIsEmptyPredicate(transformedData))) {
                return props.Empty
            }

            return props.Success(transformedData)
        }

        if (props.Empty && (props.emptyPredicate ? props.emptyPredicate(cleanData) : defaultIsEmptyPredicate(cleanData))) {
            return props.Empty
        }

        return props.Success(cleanData)
    }

    return null
}

export default QueryWrapper