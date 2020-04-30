import {
    Ref as RefType,
    forwardRef,
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

import useMount from '@/hooks/use-mount'

import { Highlight, History } from './extensions'
import { Doc, Paragraph, Text } from './nodes'
import { Bold } from './marks'
import { createDocument, minMax } from './utils'
import { EditorSchema, ExtensionType, FocusPosition } from './types'

interface Props {
    autoFocus?: boolean
    value: JSON
    onChange: Function
}
export type Ref = RefType<{
    focus: () => void
}>

const Editor = forwardRef((props: Props, ref: Ref) => {
    const viewHost = useRef<HTMLDivElement>(null)
    const view = useRef<EditorView<any> | null>(null)
    const [selection] = useState({ from: 0, to: 0 })

    useImperativeHandle(ref, () => ({
        focus: () => {
            focus(FocusPosition.End)
        },
    }))

    useMount(() => {
        const extensions = [
            new Bold(),
            new Doc(),
            new Highlight(),
            new History(),
            new Paragraph(),
            new Text(),
        ]
        const nodes = extensions
            .filter((extension) => extension.type === ExtensionType.Node)
            .reduce(
                // @ts-ignore
                (nodes, { name, schema }) => ({
                    ...nodes,
                    [name]: schema,
                }),
                {},
            )
        const marks = extensions
            .filter((extension) => extension.type === ExtensionType.Mark)
            .reduce(
                // @ts-ignore
                (marks, { name, schema }) => ({
                    ...marks,
                    [name]: schema,
                }),
                {},
            )
        const schema = new Schema({
            nodes,
            marks,
        }) as EditorSchema

        const plugins = extensions
            .filter((extension) => extension.plugins)
            .reduce(
                // @ts-ignore
                (allPlugins, { plugins }) => [...allPlugins, ...plugins],
                [],
            )

        const extensionKeymaps = extensions
            .filter((extension) =>
                [ExtensionType.Extension].includes(extension.type),
            )
            .filter((extension) => extension.keys)
            .map((extension) => extension.keys({ schema }))
        const nodeMarkKeymaps = extensions
            .filter((extension) =>
                [ExtensionType.Mark, ExtensionType.Node].includes(
                    extension.type,
                ),
            )
            .filter((extension) => extension.keys)
            .map((extension) =>
                extension.keys({
                    type: (schema as { [key: string]: any })[
                        `${extension.type}s`
                    ][extension.name],
                    schema,
                }),
            )
        const keymaps = [...extensionKeymaps, ...nodeMarkKeymaps].map((keys) =>
            keymap(keys),
        )

        const state = EditorState.create({
            doc: createDocument(schema, props.value),
            schema,
            plugins: [...plugins, ...keymaps, keymap(baseKeymap)],
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

    return <div ref={viewHost} />
})

export default Editor
