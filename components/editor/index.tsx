import { FC, useEffect, useMemo, useRef } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'

import useMount from '@/hooks/use-mount'

import schema, { createDocument } from './schema'
import { createPlugins, pluginKeys } from './plugins'

interface Props {
    autofocus?: boolean
    content: any
    onChange: Function
}

const Editor: FC<Props> = (props) => {
    const viewHost = useRef()
    const view = useRef(null)
    const rProps = useMemo(() => {}, [])

    /*
     * Lifecycle
     */

    useMount(() => {
        // Initial render
        const state = EditorState.create({
            doc: createDocument(props.content),
            schema,
            plugins: createPlugins(rProps),
        })
        view.current = new EditorView(viewHost.current, {
            state,
            dispatchTransaction,
        })

        if (props.autofocus) {
            view.current.focus()
        }
        if (process.env.NODE_ENV === 'development') {
            applyDevTools(view.current)
        }
        return () => view.current.destroy()
    })

    useEffect(() => {
        // Whenever `props` passed to `reactProps` plugin change
        const { reactPropsKey } = pluginKeys
        const tr = view.current.state.tr.setMeta(reactPropsKey, rProps)
        view.current.dispatch(tr)
    }, [rProps])

    /*
     * Functions
     */

    function dispatchTransaction(transaction) {
        const newState = view.current.state.apply(transaction)
        props.onChange(newState.doc.toJSON())
        view.current.updateState(newState)
    }

    /*
     * Render
     */

    return <div ref={viewHost} />
}

export default Editor
