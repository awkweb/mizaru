// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { Mark, Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin, Selection } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

import { Extension, ExtensionManager } from '@/components/editor/utils'
import { Doc, Paragraph, Text } from '@/components/editor/nodes'

function mkHeadings(space?: boolean) {
    return [1, 2, 3, 4, 5, 6].map((i) => ({
        tag: `h${i}`,
        syntax: `${'#'.repeat(i)}${space ? ' ' : ''}`,
        level: i,
    }))
}

function nodes(attrs: object) {
    const headings = mkHeadings().reduce(
        (obj, { tag, level }, _i) => ({
            ...obj,
            [tag]: { nodeType: 'heading', level, ...attrs },
        }),
        {},
    )
    return {
        ...headings,
    }
}

function marks(attrs: object) {
    return ['delete', 'emphasis', 'inlineCode', 'strong'].reduce(
        (obj, cur, _i) => ({
            ...obj,
            [cur]: { nodeType: cur, ...attrs },
        }),
        {},
    )
}

function out(schema: Schema, options: { node: object; mark: object }) {
    return builders(schema, {
        ...nodes(options?.node),
        ...marks(options?.mark),
        p: { nodeType: 'paragraph' },
    })
}

function type(state: EditorState, text: string) {
    return state.apply(state.tr.insertText(text))
}

function carriageReturn(state: EditorState, pos: number) {
    return state.apply(state.tr.split(pos))
}

function remove(state: EditorState, from: number, to: number) {
    return state.apply(state.tr.delete(from, to))
}

function backspace(state: EditorState, count: number) {
    return remove(state, state.doc.content.size - count, state.doc.content.size)
}

function mkExtensionManager(extensions: Extension[]) {
    return new ExtensionManager([
        ...extensions,
        new Doc(),
        new Paragraph(),
        new Text(),
    ])
}

function mkSchema(extensions: Extension[]) {
    const { nodes, marks, plugins } = mkExtensionManager(extensions)
    const schema = new Schema({
        nodes,
        marks,
    })
    return { plugins, schema }
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

export {
    out,
    backspace,
    carriageReturn,
    type,
    remove,
    mkHeadings,
    mkExtensionManager,
    mkSchema,
    mkState,
}
