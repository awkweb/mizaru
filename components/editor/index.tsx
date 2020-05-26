import { forwardRef, useImperativeHandle, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'

import { useMount } from 'react-use'

import { History, Markdown, Placeholder } from './plugins'
import { Blockquote, Doc, Heading, Paragraph, Text } from './nodes'
import { Delete, Emphasis, InlineCode, Strong } from './marks'
import { EditorRef } from './types'
import { default as EditorInstance } from './editor'

type Props = {
    autoFocus?: boolean
    value: JSON | string
    onChange: (content: JSON | string) => void
}

const Editor = forwardRef((props: Props, ref: EditorRef) => {
    const viewHost = useRef<HTMLDivElement>(null)
    const editor = useRef<EditorInstance>()

    useImperativeHandle(ref, () => ({
        focus: () => {
            editor.current?.focus()
        },
    }))

    useMount(() => {
        const marks = [
            new Delete(),
            new Emphasis(),
            new InlineCode(),
            new Strong(),
        ]
        const nodes = [
            new Blockquote(),
            new Doc(),
            new Heading(),
            new Paragraph(),
            new Text(),
        ]
        const plugins = [new History(), new Markdown(), new Placeholder()]
        const editorInstance = new EditorInstance({
            autoFocus: props.autoFocus,
            extensions: [...marks, ...nodes, ...plugins],
            element: viewHost.current as HTMLDivElement,
            content: props.value,
            onChange: props.onChange,
        })
        editor.current = editorInstance

        if (process.env.NODE_ENV === 'development') {
            applyDevTools(editor.current?.view as EditorView<any>)
        }
        return () => editor.current?.view.destroy()
    })

    return <div className="editor" ref={viewHost} />
})

export default Editor
export type { Props as EditorProps, EditorRef }
