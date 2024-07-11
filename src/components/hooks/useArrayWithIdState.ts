"use client"

import { useState } from 'react';

interface ElementWithId {
    id: number
}

export enum PushDirection {
    PushToEnd,
    PushToStart
}

export function useArrayWithIdState<T extends ElementWithId>(array: Array<T> = [], logChanges = false) {
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

    function pop(id: number) {
        arrayState.forEach((element, index) => {
            if (element.id == id) {
                setArrayState(arrayState.splice(index, 1))
            }
        })

        if (logChanges) {
            console.log({
                paramId: id,
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