"use client"

import { useState } from 'react';

export enum PushDirection {
    PushToEnd,
    PushToStart
}

export function useArrayState<T>(array: Array<T> = [], logChanges = false) {
    const [arrayState, setArrayState] = useState<Array<T>>(array);

    function set(array: Array<T>) {
        setArrayState(array)

        if (logChanges) {
            console.log({
                paramArray: array,
                internalArray: arrayState
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
                internalArray: arrayState
            })
        }
    }

    function pop(index: number) {
        setArrayState(arrayState.splice(index, 1))

        if (logChanges) {
            console.log({
                paramIndex: index,
                internalArray: arrayState
            })
        }
    }

    return {
        state: arrayState,
        set: set,
        push: push,
        pop: pop
    }
}