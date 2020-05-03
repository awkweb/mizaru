import { useContext } from 'react'

import Context, { State } from '../store'

function useStore() {
    return useContext(Context) as State
}

export default useStore
