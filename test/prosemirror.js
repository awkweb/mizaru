// eslint-disable-next-line import/named
import { builders } from 'prosemirror-test-builder'

import schema from '../components/editor/schema'

const out = builders(schema, {
    p: { nodeType: 'paragraph' },
    b: { markType: 'bold' },
})

function type(state, text) {
    return state.apply(state.tr.insertText(text))
}

function backspace(state, numSpaces) {
    return state.apply(state.tr.insertText(numSpaces))
}

function command(state, command) {
    command(state, (tr) => (state = state.apply(tr)))
    return state
}

export { out, type, backspace, command }
