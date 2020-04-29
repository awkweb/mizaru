import { FC, useRef, useState } from 'react'
import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Fragment, Schema } from 'prosemirror-model'
import applyDevTools from 'prosemirror-dev-tools'

import { baseKeymap } from 'prosemirror-commands'

import { keymap } from 'prosemirror-keymap'

import useMount from '@/hooks/use-mount'

import { Doc, Paragraph, Text } from './nodes'
import { Bold } from './marks'
import { createDocument, minMax } from './utils'
import { FocusPosition } from './types'

interface Props {
    autoFocus?: boolean
    content: Fragment
    onChange: Function
}

const Editor: FC<Props> = (props) => {
    const viewHost = useRef<HTMLDivElement>(null)
    const view = useRef<EditorView<any> | null>(null)
    const [selection] = useState({ from: 0, to: 0 })

    useMount(() => {
        const nodes = [new Doc(), new Paragraph(), new Text()].reduce(
            (nodes, { name, schema }) => ({
                ...nodes,
                [name]: schema,
            }),
            {},
        )
        const marks = [new Bold()].reduce(
            (marks, { name, schema }) => ({
                ...marks,
                [name]: schema,
            }),
            {},
        )
        const schema = new Schema({
            nodes,
            marks,
        })
        const state = EditorState.create({
            doc: createDocument(schema, props.content),
            schema,
            plugins: [keymap(baseKeymap)],
        })
        view.current = new EditorView(viewHost.current as any, {
            state,
            dispatchTransaction,
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
                from: doc.content.size,
                to: doc.content.size,
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

    return <div ref={viewHost} />
}

export default Editor
