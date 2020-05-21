import Parser from '../'

// @ts-ignore
const { mkHeadings } = prosemirror

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('only syntax', () => {
            const doc = `${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('empty heading', () => {
            const doc = `${syntax} `
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('single-word heading', () => {
            const doc = `${syntax} foo`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('multiple-word heading', () => {
            const doc = `${syntax} foo bar baz`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const doc = `${syntax} foo ~~bar~~`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const doc = `${syntax} foo *bar*`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const doc = `${syntax} foo \`bar\``
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const doc = `${syntax} foo **bar**`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const doc = `   ${syntax} foo`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('trailing', () => {
                const doc = `${syntax} foo   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading and trailing', () => {
                const doc = `   ${syntax} foo   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inner', () => {
                const doc = `${syntax}    foo`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inner and trailing', () => {
                const doc = `${syntax}    foo   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const doc = `   ${syntax}    foo`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading, inner, and trailing', () => {
                const doc = `   ${syntax}    foo   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('trailing syntax characters', () => {
                const doc = `${syntax} foo  ${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('trailing syntax characters and spaces', () => {
                const doc = `${syntax} foo  ${syntax}  ${syntax}  `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
