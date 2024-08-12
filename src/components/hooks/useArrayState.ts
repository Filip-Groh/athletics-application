"use client"

import { useState, useEffect } from 'react';

export enum PushDirection {
    PushToEnd,
    PushToStart
}

export function useArrayState<T>(array: Array<T> = [], logChanges = false) {
    const [arrayState, setArrayState] = useState<Array<T>>(array);

    useEffect(() => {
        if (logChanges) {
            console.log(arrayState)
        }
    }, [arrayState, logChanges])

    function set(array: Array<T>) {
        setArrayState(array)

        if (logChanges) {
            console.log({
                paramArray: array,
                internalArrayBefore: arrayState
            })
        }
    }

    function push(element: T, direction = PushDirection.PushToEnd) {
        const pushToEnd = () => {
            return [...arrayState, element]
        }

        const pushToStart = () => {
            return [element, ...arrayState]
        }

        setArrayState(direction ? pushToStart : pushToEnd)

        if (logChanges) {
            console.log({
                paramElement: element,
                internalArrayBefore: arrayState
            })
        }
    }

    function pop(index: number) {
        const arrayStateCopy = arrayState.slice()
        arrayStateCopy.splice(index, 1)

        setArrayState(arrayStateCopy)

        if (logChanges) {
            console.log({
                paramIndex: index,
                internalArrayBefore: arrayState
            })
        }
    }

    function change(index: number, element: T) {
        const newArray = structuredClone(arrayState)
        newArray[index] = element
        setArrayState(newArray)

        if (logChanges) {
            console.log({
                paramIndex: index,
                paramElement: element,
                internalArrayBefore: arrayState
            })
        }
    }

    return {
        state: arrayState,
        set: set,
        push: push,
        pop: pop,
        change: change
    }
}