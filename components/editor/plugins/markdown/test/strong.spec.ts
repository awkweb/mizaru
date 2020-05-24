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

for (const syntax of ['**', '__']) {
    describe(syntax, () => {
        test('single word', () => {
            const content = `${syntax}foo${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.strong(content))))
        })

        test('multiple words', () => {
            const content = `${syntax}foo bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.strong(content))))
        })

        test('backslash', () => {
            const content = `${syntax}foo\\ bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.strong(content))))
        })

        test('split across multiple lines', () => {
            const content = `${syntax}foo bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.strong(content))))
            state = carriageReturn(state, 7)
            expect(state.doc).toEqual(
                doc(
                    p(active.strong(`${syntax}foo `)),
                    p(active.strong(`bar baz${syntax}`)),
                ),
            )
            state = carriageReturn(state, 13)
            expect(state.doc).toEqual(
                doc(
                    p(active.strong(`${syntax}foo `)),
                    p(active.strong(`bar `)),
                    p(active.strong(`baz${syntax}`)),
                ),
            )
        })

        describe('with nested', () => {
            test('delete', () => {
                const content = `${syntax}foo ~~bar~~ baz${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        p(
                            active.strong(
                                `${syntax}foo `,
                                inactive.delete('~~bar~~'),
                                ` baz${syntax}`,
                            ),
                        ),
                    ),
                )
            })

            test('emphasis', () => {
                const content = `${syntax}foo *bar* baz${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        p(
                            active.strong(
                                `${syntax}foo `,
                                inactive.emphasis('*bar*'),
                                ` baz${syntax}`,
                            ),
                        ),
                    ),
                )
            })

            test('inlineCode', () => {
                const content = `${syntax}foo \`bar\` baz${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        p(
                            active.strong(
                                `${syntax}foo `,
                                inactive.inlineCode('`bar`'),
                                ` baz${syntax}`,
                            ),
                        ),
                    ),
                )
            })
        })
    })
}
