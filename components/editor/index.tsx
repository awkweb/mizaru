import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import applyDevTools from 'prosemirror-dev-tools'
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'

import { useMount } from '@/hooks'

import { Highlight, History } from './plugins'
import { Doc, Paragraph, Text } from './nodes'
import { Bold } from './marks'
import { ExtensionManager, createDocument, minMax } from './utils'
import { EditorRef, EditorSchema, FocusPosition } from './types'

interface Props {
    autoFocus?: boolean
    searchTerm?: string
    value: JSON
    onChange: Function
}

const Editor = forwardRef((props: Props, ref: EditorRef) => {
    const viewHost = useRef<HTMLDivElement>(null)
    const view = useRef<EditorView<any> | null>(null)
    const commands = useRef<{ [key: string]: Function }>(null)
    const [selection] = useState({ from: 0, to: 0 })

    useImperativeHandle(ref, () => ({
        focus: () => {
            focus(FocusPosition.End)
        },
    }))

    useMount(() => {
        const extensions = new ExtensionManager([
            new Bold(),
            new Doc(),
            new Highlight(),
            new History(),
            new Paragraph(),
            new Text(),
        ])
        const nodes = extensions.nodes
        const marks = extensions.marks
        const schema = new Schema({
            nodes,
            marks,
        }) as EditorSchema

        const state = EditorState.create({
            doc: createDocument(schema, props.value),
            schema,
            plugins: [
                ...extensions.plugins,
                ...extensions.keymaps({ schema }),
                keymap(baseKeymap),
            ],
        })
        view.current = new EditorView(viewHost.current as any, {
            state,
            dispatchTransaction,
        })
        // @ts-ignore
        commands.current = extensions.commands({
            schema,
            view: view.current,
        })

        if (props.autoFocus) {
            focus(FocusPosition.End)
        }
        if (process.env.NODE_ENV === 'development') {
            applyDevTools(view.current as EditorView<any>)
        }
        return () => view.current?.destroy()
    })

    const dispatchTransaction = (transaction: Transaction) => {
        const newState = view.current?.state.apply(transaction) as EditorState<
            any
        >
        props.onChange(newState?.doc.toJSON())
        view.current?.updateState(newState)

        if (transaction.docChanged) {
            search()
        }
    }

    const resolveSelection = (position?: FocusPosition | boolean) => {
        if (selection && position === null) {
            return selection
        }

        if (position === FocusPosition.Start || position === true) {
            return {
                from: 0,
                to: 0,
            }
        }

        if (position === FocusPosition.End) {
            const { doc } = view.current?.state as EditorState<any>
            return {
                from: doc.content.size - 1,
                to: doc.content.size - 1,
            }
        }

        return {
            from: position,
            to: position,
        }
    }

    const focus = (position?: FocusPosition | boolean) => {
        if (
            (view.current?.hasFocus() && position === null) ||
            position === false
        ) {
            return
        }

        const { from, to } = resolveSelection(position)
        setSelection(from as number, to as number)
        setTimeout(() => view.current?.focus(), 10)
    }

    const setSelection = (from = 0, to = 0) => {
        const { doc, tr } = view.current?.state as EditorState<any>
        const resolvedFrom = minMax(from, 0, doc.content.size)
        const resolvedEnd = minMax(to, 0, doc.content.size)
        const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd)
        const transaction = tr.setSelection(selection)

        view.current?.dispatch(transaction)
    }

    const search = useCallback(() => {
        if (props.searchTerm) {
            commands.current?.find(props.searchTerm)
        } else {
            commands.current?.clearSearch()
        }
    }, [props.searchTerm])

    useEffect(() => {
        search()
    }, [search, props.searchTerm])

    return <div ref={viewHost} />
})

export default Editor
