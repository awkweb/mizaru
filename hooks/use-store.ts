import { useContext } from 'react'

import Context from '../store'

function useStore() {
    return useContext(Context)
}

export default useStore
