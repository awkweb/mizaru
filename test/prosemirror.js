// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { EditorState } from 'prosemirror-state'

function out(schema) {
    return builders(schema, {
        p: { nodeType: 'paragraph' },
        a: { nodeType: 'link', href: 'https://example.com' },
    })
}

function type(state, text) {
    return state.apply(state.tr.insertText(text))
}

function remove(state, from, to) {
    return state.apply(state.tr.delete(from, to))
}

function command(state, command) {
    command(state, (tr) => (state = state.apply(tr)))
    return state
}

function mkState(config) {
    return EditorState.create(config)
}

export { out, type, remove, command, mkState }
