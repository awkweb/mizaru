import { Delete, Emphasis, InlineCode, Strong } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { out, carriageReturn, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([
    new Delete(),
    new Emphasis(),
    new InlineCode(),
    new Markdown(),
    new Strong(),
])
const { doc, p } = out(schema)
const active = out(schema, {
    mark: { active: true },
})

test('single word', () => {
    const content = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
})

test('multiple words', () => {
    const content = '`foo bar baz`'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
})

test('backslash', () => {
    // prettier-ignore
    const content = '`foo\ bar baz`'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
})

test('split across multiple lines', () => {
    const content = '`foo bar baz`'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
    state = carriageReturn(state, 6)
    expect(state.doc).toEqual(
        doc(p(active.inlineCode('`foo ')), p(active.inlineCode('bar baz`'))),
    )
    state = carriageReturn(state, 12)
    expect(state.doc).toEqual(
        doc(
            p(active.inlineCode('`foo ')),
            p(active.inlineCode('bar ')),
            p(active.inlineCode('baz`')),
        ),
    )
})

describe('with nested', () => {
    test('delete', () => {
        const content = '`foo ~~bar~~ baz`'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
    })

    test('emphasis', () => {
        const content = '`foo *bar* baz`'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
    })

    test('strong', () => {
        const content = '`foo **bar** baz`'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
    })
})
