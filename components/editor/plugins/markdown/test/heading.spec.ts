import { Heading } from '@/components/editor/nodes'
import { Delete, Emphasis, InlineCode, Strong } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { backspace, out, type, mkHeadings, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([
    new Delete(),
    new Emphasis(),
    new Heading(),
    new InlineCode(),
    new Markdown(),
    new Strong(),
])
const { doc, p, ...inactive } = out(schema)
const active = out(schema, {
    node: { active: true },
    mark: { active: true },
})

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    const heading = active[tag]
    describe(tag, () => {
        test('empty', () => {
            const content = `${syntax} `
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(heading(content)))
        })

        test('single word', () => {
            const content = `${syntax} foo`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(heading(content)))
        })

        test('multiple words', () => {
            const content = `${syntax} foo bar baz`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(heading(content)))
        })

        test('backslash', () => {
            const content = `${syntax} foo\ bar baz`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(heading(content)))
        })

        test('escaped', () => {
            const content = `\\${syntax} foo bar baz`
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(content)))
        })

        describe('with nested', () => {
            test('delete', () => {
                const content = `${syntax} foo ~~bar~~ baz`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        heading(
                            `${syntax} foo `,
                            inactive.delete('~~bar~~'),
                            ' baz',
                        ),
                    ),
                )
            })

            test('emphasis', () => {
                const content = `${syntax} foo *bar* baz`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        heading(
                            `${syntax} foo `,
                            inactive.emphasis('*bar*'),
                            ' baz',
                        ),
                    ),
                )
            })

            test('inlineCode', () => {
                const content = `${syntax} foo \`bar\` baz`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        heading(
                            `${syntax} foo `,
                            inactive.inlineCode('`bar`'),
                            ' baz',
                        ),
                    ),
                )
            })

            test('strong', () => {
                const content = `${syntax} foo **bar** baz`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(
                    doc(
                        heading(
                            `${syntax} foo `,
                            inactive.strong('**bar**'),
                            ' baz',
                        ),
                    ),
                )
            })
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const content = `   ${syntax} foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('trailing', () => {
                const content = `${syntax} foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('leading and trailing', () => {
                const content = `   ${syntax} foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('inner', () => {
                const content = `${syntax}    foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('inner and trailing', () => {
                const content = `${syntax}    foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('leading and inner', () => {
                const content = `   ${syntax}    foo`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('leading, inner, and trailing', () => {
                const content = `   ${syntax}    foo   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })
        })

        describe('with closing sequence', () => {
            test('same number of syntax characters', () => {
                const content = `${syntax} foo bar baz ${syntax}`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('different number of syntax characters', () => {
                const content = `${syntax} foo bar baz ${syntax}#`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('trailing whitespace', () => {
                const content = `${syntax} foo bar baz ${syntax}   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('random syntax characters', () => {
                const content = `${syntax} foo bar baz # ##  #`
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })

            test('random syntax characters and trailing whitespace', () => {
                const content = `${syntax} foo bar baz # ##  #   `
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(heading(content)))
            })
        })
    })
}

describe('editing', () => {
    test('type', () => {
        let state = mkState({ schema, plugins })
        state = type(state, '#')
        expect(state.doc).toEqual(doc(p('#')))
        state = type(state, ' foo bar baz')
        expect(state.doc).toEqual(doc(active.h1('# foo bar baz')))
    })

    test('backspace', () => {
        let state = mkState({ schema, plugins })
        state = type(state, '# foo bar baz')
        expect(state.doc).toEqual(doc(active.h1('# foo bar baz')))
        state = backspace(state, 13)
        expect(state.doc).toEqual(doc(p('#')))
    })
})
