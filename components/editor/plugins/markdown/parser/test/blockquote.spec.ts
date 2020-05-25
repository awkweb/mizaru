import Parser from '../'

// @ts-ignore
const { mkHeadings } = prosemirror
const headings = mkHeadings()

for (const syntax of ['>', '> ']) {
    describe(syntax, () => {
        test('empty', () => {
            const doc = `${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('single word', () => {
            const doc = `${syntax}foo`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('multiple words', () => {
            const doc = `${syntax}foo bar baz`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('backslash', () => {
            const doc = `${syntax}foo\\ bar baz`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const doc = `${syntax}foo\nbar\nbaz`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const doc = `${syntax}foo ~~bar~~ baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const doc = `${syntax}foo *bar* baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const doc = `${syntax}foo \`bar\` baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const doc = `${syntax}foo **bar** baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            for (const heading of headings) {
                test(heading.tag, () => {
                    const doc = `${syntax}${heading.syntax} foo bar baz`
                    const out = Parser.parse(doc)
                    expect(out).toMatchSnapshot()
                })
            }
        })

        describe('with whitespace', () => {
            test('leading', () => {
                const doc = `   ${syntax}foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inner', () => {
                const doc = `${syntax}   foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const doc = `   ${syntax}   foo bar baz`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
