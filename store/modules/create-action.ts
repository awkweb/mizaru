// Based on https://patrickdesjardins.com/blog/typescript-with-strong-typed-action-when-using-usereducer-of-react-hooks

/**
 * Create an action with a payload
 */
export interface ActionsWithPayload<T, P> {
    type: T
    payload: P
}

/**
 * Create an action that does not have a payload
 */
export interface ActionsWithoutPayload<T> {
    type: T
}

/**
 * Create an action that has a strongly typed string literal name with a strongly typed payload
 */
export function createActionPayload<T, P>(
    type: T,
): (p: P) => ActionsWithPayload<T, P> {
    return (payload: P): ActionsWithPayload<T, P> => ({
        payload,
        type,
    })
}

/**
 * Create an action with no payload
 */
export function createAction<T>(type: T): () => ActionsWithoutPayload<T> {
    return (): ActionsWithoutPayload<T> => ({
        type,
    })
}

/**
 * A very general type that means to be "an object with a many field created with createActionPayload and createAction
 */
interface ActionCreatorsMapObject {
    [key: string]: (
        ...args: any[]
    ) => ActionsWithPayload<any, any> | ActionsWithoutPayload<any>
}

/**
 * Use this Type to merge several action object that has field created with createActionPayload or createAction
 * E.g. type ReducerWithActionFromTwoObjects = ActionsUnion<typeof ActionsObject1 & typeof ActionsObject2>;
 */
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
    A[keyof A]
>
