import { User } from '@types'

import { ActionsUnion, createActionPayload } from '../create-action'

export const SET_USER = 'user/SET_USER'
export const actions = {
    setUser: createActionPayload<User>(SET_USER),
}

export const state = {
    user: null,
}
export type State = typeof state
export type Actions = ActionsUnion<typeof actions>

export function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            }
    }
    return state
}
