import { User } from '@types'

import { ActionsUnion, createActionPayload } from '../create-action'

enum TypeAction {
    SET_COOKIE = 'auth/SET_COOKIE',
    SET_EMAIL = 'auth/SET_EMAIL',
    SET_PASSWORD = 'auth/SET_PASSWORD',
}

export const actions = {
    setCookie: createActionPayload<
        typeof TypeAction.SET_COOKIE,
        { token: string; user: User }
    >(TypeAction.SET_COOKIE),
    setEmail: createActionPayload<typeof TypeAction.SET_EMAIL, string>(
        TypeAction.SET_EMAIL,
    ),
    setPassword: createActionPayload<typeof TypeAction.SET_PASSWORD, string>(
        TypeAction.SET_PASSWORD,
    ),
}

export const state = {
    email: '',
    password: '',
    token: '',
}
export type State = typeof state
export type Actions = ActionsUnion<typeof actions>

export function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case TypeAction.SET_COOKIE:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
            }
        case TypeAction.SET_EMAIL:
            return {
                ...state,
                email: action.payload,
            }
        case TypeAction.SET_PASSWORD:
            return {
                ...state,
                password: action.payload,
            }
    }
    return state
}
