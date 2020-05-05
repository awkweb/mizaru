import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'

import { Transaction } from 'prosemirror-state'

import { useMount } from '@/hooks'

import { Highlight, History, Markdown, ReactProps } from './plugins'
import { Doc, Paragraph, Text } from './nodes'
import { Bold, Code, Italic } from './marks'
import { EditorRef } from './types'
import { default as EditorInstance } from './editor'

type Props = {
    autoFocus?: boolean
    searchTerm?: string
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
        const editorInstance = new EditorInstance({
            autoFocus: props.autoFocus,
            extensions: [
                new Bold(),
                new Code(),
                new Italic(),
                new Doc(),
                new Highlight({
                    caseSensitive: false,
                }),
                new History(),
                new Markdown(),
                new Paragraph(),
                new ReactProps(props),
                new Text(),
            ],
            element: viewHost.current as HTMLDivElement,
            content: props.value,
            onChange: props.onChange,
            onTransaction,
        })
        editor.current = editorInstance

        if (process.env.NODE_ENV === 'development') {
            applyDevTools(editor.current?.view as EditorView<any>)
        }
        return () => editor.current?.view.destroy()
    })

    useEffect(() => {
        if (props.searchTerm === undefined) return
        editor.current?.commands.search(props.searchTerm)
    }, [props.searchTerm])

    useEffect(() => {
        editor.current?.commands.updateReactProps({
            searchTerm: props.searchTerm,
        })
    }, [props.searchTerm])

    const onTransaction = (transaction: Transaction) => {
        if (transaction.docChanged) {
            const { searchTerm } = editor.current?.commands.getReactProps()
            editor.current?.commands.search(searchTerm)
        }
    }

    return <div ref={viewHost} />
})

export default Editor
export type { Props as EditorProps }
