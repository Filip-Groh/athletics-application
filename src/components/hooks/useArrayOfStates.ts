"use client"

import { Dispatch, SetStateAction, useState } from 'react';

export enum PushDirection {
    PushToEnd,
    PushToStart
}

interface UseStateType<T> {
    state: T,
    setState: Dispatch<SetStateAction<T>>
}

function arrayOfValuesToArrayOfState<T>(array: Array<T> = []): UseStateType<T>[] {
    return array.map((value) => {
        const [state, setState] = useState<T>(value);

        return {
            state: state,
            setState: setState
        }
    })
}

export function useArrayState<T>(array: Array<T> = [], logChanges = false) {
    arrayOfValuesToArrayOfState<T>(array)
    const [arrayState, setArrayState] = useState<Array<T>>();

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
        const elementState = useState(element)

        const pushToEnd = () => {
            return [...arrayState, elementState]
        }

        const pushToStart = () => {
            return [elementState, ...arrayState]
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