import { EditorState } from 'prosemirror-state'

import schema from '../../../schema'
import markdown from '../'

const { doc, p, b } = out
let plugin = markdown()

function mkState(doc, config) {
    let plugins = [config ? markdown(config) : plugin]
    return EditorState.create({
        schema,
        plugins: plugins.concat((config && config.plugins) || []),
        doc,
    })
}

describe('markdown', () => {
    describe('bold', () => {
        // TODO: Test decorations
        it('enables type', () => {
            let state = mkState()
            state = type(state, '**foo**')
            expect(state.doc).toEqual(doc(p(b('**foo**'))))

            state = mkState()
            state = type(state, '__foo__')
            expect(state.doc).toEqual(doc(p(b('__foo__'))))
        })

        it('enables delete', () => {})

        describe('enables paste', () => {
            it('markdown', () => {})
            it('html', () => {})
        })

        it('enables Mod-b', () => {})
    })
})
