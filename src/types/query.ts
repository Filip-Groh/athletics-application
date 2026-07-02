export type MinimalError = { message: string }
export type CoerceAsyncIterableToArray<TValue> = TValue extends AsyncIterable<infer $Inferred> ? $Inferred[] : TValue