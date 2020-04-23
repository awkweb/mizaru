import { EffectCallback, useEffect } from 'react'

// eslint-disable react-hooks/exhaustive-deps
function useMount(callback: EffectCallback) {
    useEffect(callback, [])
}
export default useMount
