import * as Auth from './auth'
import * as User from './user'

export const actions = {
    auth: Auth.actions,
    user: User.actions,
}
export type Actions = Auth.Actions | User.Actions

export const initialState = {
    auth: Auth.state,
    user: User.state,
}
export type State = typeof initialState

export const reducer = ({ auth, user }: State, action: Actions): State => ({
    auth: Auth.reducer(auth, action as Auth.Actions),
    user: User.reducer(user, action as User.Actions),
})
