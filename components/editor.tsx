import { FC, useEffect, useRef } from 'react'
import { schema } from 'prosemirror-schema-basic'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import applyDevTools from 'prosemirror-dev-tools'

import useMount from '@/hooks/use-mount'

interface Props {
    doc: any
    onSave: Function
}

const reactPropsKey = new PluginKey('reactProps')
function reactProps(initialProps: Partial<Props>) {
    return new Plugin({
        key: reactPropsKey,
        state: {
            init: () => initialProps,
            apply: (tr, prev) => tr.getMeta(reactPropsKey) || prev,
        },
    })
}

const Editor: FC<Props> = ({ doc, ...props }) => {
    const viewHost = useRef()
    const view = useRef(null)

    useMount(() => {
        // initial render
        const state = EditorState.create({
            doc,
            schema,
            plugins: [
                history(),
                keymap({
                    // @ts-ignore
                    'Mod-s': (state: any, dispatch: any) => {
                        const { onSave } = reactPropsKey.getState(state)
                        onSave(state.doc.toJSON())
                        return true
                    },
                }),
                keymap({ 'Mod-z': undo, 'Shift-Mod-z': redo, 'Mod-y': redo }),
                keymap(baseKeymap),
                reactProps(props),
            ],
        })
        view.current = new EditorView(viewHost.current, { state })

        if (process.env.NODE_ENV === 'development') {
            applyDevTools(view.current)
        }
        return () => view.current.destroy()
    })

    useEffect(() => {
        const tr = view.current.state.tr.setMeta(reactPropsKey, props)
        view.current.dispatch(tr)
    })

    return <div ref={viewHost} />
}

export default Editor
