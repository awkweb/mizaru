import React, {
    Dispatch,
    FC,
    createContext,
    useContext,
    useReducer,
} from 'react'

import { Actions, State, initialState } from './modules'

export const Context = createContext<[State, Dispatch<Actions>]>([
    initialState,
    (action: Actions) => {},
])

type Props = {
    reducer: (state: State, action: Actions) => State
    initialState: State
}

export const Provider: FC<Props> = ({ reducer, initialState, children }) => (
    <Context.Provider value={useReducer(reducer, initialState)}>
        {children}
    </Context.Provider>
)

export const useStore = (): [State, Dispatch<Actions>] => useContext(Context)

export default Context
export { actions, initialState, reducer } from './modules'
