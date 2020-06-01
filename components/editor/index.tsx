import { Ref as ReactRef, forwardRef, useImperativeHandle, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'

import { useMount } from 'react-use'

import { History, Markdown, Placeholder } from './plugins'
import {
    Blockquote,
    Doc,
    HardBreak,
    Heading,
    ListItem,
    OrderedList,
    Paragraph,
    Text,
    UnorderedList,
} from './nodes'
import { Delete, Emphasis, InlineCode, Strong } from './marks'
import { default as EditorInstance } from './editor'

type Props = {
    autoFocus?: boolean
    value: string
    onChange: (content: string) => void
}

type Ref = ReactRef<{
    focus: () => void
}>

const Editor = forwardRef((props: Props, ref: Ref) => {
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
            new HardBreak(),
            new Heading(),
            new ListItem(),
            new OrderedList(),
            new UnorderedList(),
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
export { keys } from './constants'
export type { Props as EditorProps, Ref as EditorRef }
