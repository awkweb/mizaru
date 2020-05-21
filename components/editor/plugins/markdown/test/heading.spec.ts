import { Heading } from '@/components/editor/nodes'
import { Delete, Emphasis, InlineCode, Strong } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { out, type, mkHeadings, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([
    new Delete(),
    new Emphasis(),
    new Heading(),
    new InlineCode(),
    new Markdown(),
    new Strong(),
])
const { doc, p } = out(schema)
const active = out(schema, {
    node: { active: true },
    mark: { active: true },
})

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('only syntax', () => {
            const content = `${syntax}`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(content)))
        })

        test('empty heading', () => {
            const content = `${syntax} `
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(active[tag](content)))
        })

        test('single-word heading', () => {
            const content = `${syntax} foo`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(active[tag](content)))
        })

        test('multiple-word heading', () => {
            const content = `${syntax} foo bar baz`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(active[tag](content)))
        })

        describe('with nested', () => {
            test('delete', () => {
                const content = `${syntax} foo ~~bar~~`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        active[tag](`${syntax} foo `, active.delete('~~bar~~')),
                    ),
                )
            })

            test('emphasis', () => {
                const content = `${syntax} foo *bar*`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        active[tag](`${syntax} foo `, active.emphasis('*bar*')),
                    ),
                )
            })

            test('inlineCode', () => {
                const content = `${syntax} foo \`bar\``
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        active[tag](
                            `${syntax} foo `,
                            active.inlineCode('`bar`'),
                        ),
                    ),
                )
            })

            test('strong', () => {
                const content = `${syntax} foo **bar**`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        active[tag](`${syntax} foo `, active.strong('**bar**')),
                    ),
                )
            })
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const content = `   ${syntax} foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(p(content)))
            })

            test('trailing', () => {
                const content = `${syntax} foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(active[tag](content)))
            })

            test('leading and trailing', () => {
                const content = `   ${syntax} foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(p(content)))
            })

            test('inner', () => {
                const content = `${syntax}    foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(active[tag](content)))
            })

            test('inner and trailing', () => {
                const content = `${syntax}    foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(active[tag](content)))
            })

            test('leading and inner', () => {
                const content = `   ${syntax}    foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(p(content)))
            })

            test('leading, inner, and trailing', () => {
                const content = `   ${syntax}    foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(p(content)))
            })

            test('trailing syntax characters', () => {
                const content = `${syntax} foo  ${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(active[tag](content)))
            })

            test('trailing syntax characters and spaces', () => {
                const content = `${syntax} foo  ${syntax}  ${syntax}  `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(active[tag](content)))
            })
        })
    })
}
