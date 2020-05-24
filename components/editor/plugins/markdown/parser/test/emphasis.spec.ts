import Parser from '../'

for (const syntax of ['*', '_']) {
    describe(syntax, () => {
        test('single word', () => {
            const doc = `${syntax}foo${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('multiple words', () => {
            const doc = `${syntax}foo bar baz${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('backslash', () => {
            const doc = `${syntax}foo\\ bar baz${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const doc = `${syntax}foo\nbar\nbaz${syntax}`
            const out = Parser.parse(doc)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const doc = `${syntax}foo ~~bar~~ baz${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const doc = `${syntax}foo *bar* baz${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const doc = `${syntax}foo \`bar\` baz${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const doc = `${syntax}foo **bar** baz${syntax}`
                const out = Parser.parse(doc)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
