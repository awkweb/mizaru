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
const { doc, p, ...inactive } = out(schema)
const active = out(schema, {
    mark: { active: true },
})

test('single word', () => {
    const content = '~~foo~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.delete(content))))
})

test('multiple words', () => {
    const content = '~~foo bar baz~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.delete(content))))
})

test('backslash', () => {
    const content = '~~foo\\ bar baz~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.delete(content))))
})

test('escaped', () => {
    const content = '\\~~foo bar baz~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('split across multiple lines', () => {
    const content = '~~foo bar baz~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.delete(content))))
    state = carriageReturn(state, 7)
    expect(state.doc).toEqual(
        doc(p(active.delete('~~foo ')), p(active.delete('bar baz~~'))),
    )
    state = carriageReturn(state, 13)
    expect(state.doc).toEqual(
        doc(
            p(active.delete('~~foo ')),
            p(active.delete('bar ')),
            p(active.delete('baz~~')),
        ),
    )
})

describe('with nested', () => {
    test('emphasis', () => {
        const content = '~~foo *bar* baz~~'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(
            doc(
                p(
                    active.delete(
                        '~~foo ',
                        inactive.emphasis('*bar*'),
                        ' baz~~',
                    ),
                ),
            ),
        )
    })

    test('inlineCode', () => {
        const content = '~~foo `bar` baz~~'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(
            doc(
                p(
                    active.delete(
                        '~~foo ',
                        inactive.inlineCode('`bar`'),
                        ' baz~~',
                    ),
                ),
            ),
        )
    })

    test('strong', () => {
        const content = '~~foo **bar** baz~~'
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(
            doc(
                p(
                    active.delete(
                        '~~foo ',
                        inactive.strong('**bar**'),
                        ' baz~~',
                    ),
                ),
            ),
        )
    })
})
