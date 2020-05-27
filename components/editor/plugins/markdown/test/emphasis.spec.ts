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

for (const syntax of ['*', '_']) {
    describe(syntax, () => {
        test('single word', () => {
            const content = `${syntax}foo${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.emphasis(content))))
        })

        test('multiple words', () => {
            const content = `${syntax}foo bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.emphasis(content))))
        })

        test('backslash', () => {
            const content = `${syntax}foo\\ bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.emphasis(content))))
        })

        test('escaped', () => {
            const content = `\\${syntax}foo bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(content)))
        })

        test('split across multiple lines', () => {
            const content = `${syntax}foo bar baz${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.emphasis(content))))
            state = carriageReturn(state, 6)
            expect(state.doc).toEqual(
                doc(
                    p(active.emphasis(`${syntax}foo `)),
                    p(active.emphasis(`bar baz${syntax}`)),
                ),
            )
            state = carriageReturn(state, 12)
            expect(state.doc).toEqual(
                doc(
                    p(active.emphasis(`${syntax}foo `)),
                    p(active.emphasis(`bar `)),
                    p(active.emphasis(`baz${syntax}`)),
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
                            active.emphasis(
                                `${syntax}foo `,
                                inactive.delete('~~bar~~'),
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
                            active.emphasis(
                                `${syntax}foo `,
                                inactive.inlineCode('`bar`'),
                                ` baz${syntax}`,
                            ),
                        ),
                    ),
                )
            })

            test('strong', () => {
                const content = `${syntax}foo **bar** baz${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        p(
                            active.emphasis(
                                `${syntax}foo `,
                                inactive.strong('**bar**'),
                                ` baz${syntax}`,
                            ),
                        ),
                    ),
                )
            })
        })
    })
}
