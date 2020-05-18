import { Heading } from '@/components/editor/nodes'

import Markdown from '..'

// @ts-ignore
const { out, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Heading(), new Markdown()])
const { doc, p } = out(schema)
const active = out(schema, {
    node: { active: true },
})

describe('basic', () => {
    const headings = [
        { tag: 'h1', syntax: '# ' },
        { tag: 'h2', syntax: '## ' },
        { tag: 'h3', syntax: '### ' },
        { tag: 'h4', syntax: '#### ' },
        { tag: 'h5', syntax: '##### ' },
        { tag: 'h6', syntax: '###### ' },
    ]
    for (let { tag, syntax } of headings) {
        const content = `${syntax} foo`
        test(content, () => {
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(active[tag](content)))
        })
    }
})

describe('edge cases', () => {
    test.only('no space after syntax', () => {
        const content = '#Testing'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(content)))
    })

    test('more than one space after syntax', () => {
        const content = '#          Testing'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(active.h1(content)))
    })

    test('leading spaces', () => {
        const content = '   # Testing'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(content)))
    })

    test('trailing spaces', () => {
        const content = '# Testing  '
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(active.h1(content)))
    })
})
