// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { Mark, Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin, Selection, Transaction } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

const headings = (attrs: object) =>
    [1, 2, 3, 4, 5, 6].reduce(
        (obj, cur, _i) => ({
            ...obj,
            [`h${cur}`]: { nodeType: 'heading', level: cur, ...attrs },
        }),
        {},
    )
const inlines = (attrs: object) =>
    ['strong', 'inlineCode', 'delete', 'emphasis'].reduce(
        (obj, cur, _i) => ({
            ...obj,
            [cur]: { nodeType: cur, ...attrs },
        }),
        {},
    )

function out(schema: Schema, options: { node: object; mark: object }) {
    return builders(schema, {
        ...headings(options?.node),
        ...inlines(options?.mark),
        p: { nodeType: 'paragraph' },
        link: {
            markType: 'link',
            href: 'https://example.com',
            ...options?.mark,
        },
    })
}

function type(state: EditorState, text: string) {
    return state.apply(state.tr.insertText(text))
}

function remove(state: EditorState, from: number, to: number) {
    return state.apply(state.tr.delete(from, to))
}

function command(state: EditorState, command: Function) {
    command(state, (tr: Transaction) => (state = state.apply(tr)))
    return state
}

function mkState(config: {
    schema?: Schema | any
    doc?: ProsemirrorNode | null
    selection?: Selection | null
    storedMarks?: Mark[] | null
    plugins?: Array<Plugin<any, any>> | null
}) {
    return EditorState.create(config)
}

export { out, type, remove, command, mkState }
console.log(`"${node.textContent}"`)
