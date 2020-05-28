import Parser from '../'

// @ts-ignore
const { mkHeadings } = prosemirror

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('empty', () => {
            const content = `${syntax} `
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('single word', () => {
            const content = `${syntax} foo`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('multiple words', () => {
            const content = `${syntax} foo bar baz`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('backslash', () => {
            const content = `${syntax} foo\\ bar baz`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('escaped', () => {
            const content = `\\${syntax} foo bar baz`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const content = `${syntax} foo\nbar\nbaz`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const content = `${syntax} foo ~~bar~~ baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const content = `${syntax} foo *bar* baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const content = `${syntax} foo \`bar\` baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const content = `${syntax} foo **bar** baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const content = `   ${syntax} foo bar baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('trailing', () => {
                const content = `${syntax} foo bar baz   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('leading and trailing', () => {
                const content = `   ${syntax} foo bar baz   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('inner', () => {
                const content = `${syntax}    foo bar baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('inner and trailing', () => {
                const content = `${syntax}    foo bar baz   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const content = `   ${syntax}    foo bar baz`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('leading, inner, and trailing', () => {
                const content = `   ${syntax}    foo bar baz   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })
        })

        describe('with closing sequence', () => {
            test('same number of syntax characters', () => {
                const content = `${syntax} foo bar baz ${syntax}`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('different number of syntax characters', () => {
                const content = `${syntax} foo bar baz ${syntax}#`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('trailing whitespace', () => {
                const content = `${syntax} foo bar baz ${syntax}   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('random syntax characters', () => {
                const content = `${syntax} foo bar baz # ##  #`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('random syntax characters and trailing whitespace ', () => {
                const content = `${syntax} foo bar baz # ##  #   `
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
