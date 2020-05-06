// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'
import { EditorState } from 'prosemirror-state'

function out(schema, { markAttrs } = {}) {
    return builders(schema, {
        strong: { markType: 'strong', ...markAttrs },
        codespan: { markType: 'codespan', ...markAttrs },
        del: { markType: 'del', ...markAttrs },
        em: { markType: 'em', ...markAttrs },
        p: { nodeType: 'paragraph' },
        link: { markType: 'link', href: 'https://example.com', ...markAttrs },
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
