import Parser from '../'

// @ts-ignore
const { mkHeadings } = prosemirror

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('empty', () => {
            const doc = `${syntax} `
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('single word', () => {
            const doc = `${syntax} foo`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('multiple words', () => {
            const doc = `${syntax} foo bar baz`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const doc = `${syntax} foo ~~bar~~ baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const doc = `${syntax} foo *bar* baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const doc = `${syntax} foo \`bar\` baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const doc = `${syntax} foo **bar** baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const doc = `   ${syntax} foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('trailing', () => {
                const doc = `${syntax} foo bar baz   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading and trailing', () => {
                const doc = `   ${syntax} foo bar baz   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inner', () => {
                const doc = `${syntax}    foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inner and trailing', () => {
                const doc = `${syntax}    foo bar baz   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const doc = `   ${syntax}    foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading, inner, and trailing', () => {
                const doc = `   ${syntax}    foo bar baz   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })

        describe('with closing sequence', () => {
            test('same number of syntax characters', () => {
                const doc = `${syntax} foo bar baz ${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('different number of syntax characters', () => {
                const doc = `${syntax} foo bar baz ${syntax}#`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('trailing whitespace', () => {
                const doc = `${syntax} foo bar baz ${syntax}   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('random syntax characters', () => {
                const doc = `${syntax} foo bar baz # ##  #`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('random syntax characters and trailing whitespace ', () => {
                const doc = `${syntax} foo bar baz # ##  #   `
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
