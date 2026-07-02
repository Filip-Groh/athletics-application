export type Data = {
    age: number,
    [subEventName: string]: number
}

export type Dataset = Record<string, Data[]>