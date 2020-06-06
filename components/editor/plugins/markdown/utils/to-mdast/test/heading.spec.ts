import toMDAST from '../'

// @ts-ignore
const { mkHeadings } = prosemirror

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('empty', () => {
            const mdast = toMDAST(`${syntax} `)
            expect(mdast).toMatchSnapshot()
        })

        test('single word', () => {
            const mdast = toMDAST(`${syntax} foo`)
            expect(mdast).toMatchSnapshot()
        })

        test('multiple words', () => {
            const mdast = toMDAST(`${syntax} foo bar baz`)
            expect(mdast).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const mdast = toMDAST(`${syntax} foo\nbar\nbaz`)
            expect(mdast).toMatchSnapshot()
        })

        describe('nested', () => {
            test('emphasis', () => {
                const mdast = toMDAST(`${syntax} foo *bar* baz`)
                expect(mdast).toMatchSnapshot()
            })

            test('strong', () => {
                const mdast = toMDAST(`${syntax} foo **bar** baz`)
                expect(mdast).toMatchSnapshot()
            })
        })

        describe('whitespace', () => {
            test('leading', () => {
                const mdast = toMDAST(`   ${syntax} foo bar baz`)
                expect(mdast).toMatchSnapshot()
            })

            test('trailing', () => {
                const mdast = toMDAST(`${syntax} foo bar baz   `)
                expect(mdast).toMatchSnapshot()
            })

            test('leading and trailing', () => {
                const mdast = toMDAST(`   ${syntax} foo bar baz   `)
                expect(mdast).toMatchSnapshot()
            })

            test('inner', () => {
                const mdast = toMDAST(`${syntax}    foo bar baz`)
                expect(mdast).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const mdast = toMDAST(`   ${syntax}    foo bar baz`)
                expect(mdast).toMatchSnapshot()
            })

            test('inner and trailing', () => {
                const mdast = toMDAST(`${syntax}    foo bar baz   `)
                expect(mdast).toMatchSnapshot()
            })

            test('leading, inner, and trailing', () => {
                const mdast = toMDAST(`   ${syntax}    foo bar baz   `)
                expect(mdast).toMatchSnapshot()
            })
        })

        describe('closing sequence', () => {
            test('same number of syntax characters', () => {
                const mdast = toMDAST(`${syntax} foo bar baz ${syntax}`)
                expect(mdast).toMatchSnapshot()
            })

            test('different number of syntax characters', () => {
                const mdast = toMDAST(`${syntax} foo bar baz ${syntax}#`)
                expect(mdast).toMatchSnapshot()
            })

            test('trailing whitespace', () => {
                const mdast = toMDAST(`${syntax} foo bar baz ${syntax}   `)
                expect(mdast).toMatchSnapshot()
            })

            test('random', () => {
                const mdast = toMDAST(`${syntax} foo bar baz # ##   #`)
                expect(mdast).toMatchSnapshot()
            })

            test('random and trailing whitespace', () => {
                const mdast = toMDAST(`${syntax} foo bar baz # ##   #   `)
                expect(mdast).toMatchSnapshot()
            })
        })
    })
}
