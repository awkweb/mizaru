import Parser from '../'

for (const syntax of ['*', '_']) {
    describe(syntax, () => {
        test('single word', () => {
            const content = `${syntax}foo${syntax}`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('multiple words', () => {
            const content = `${syntax}foo bar baz${syntax}`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('backslash', () => {
            const content = `${syntax}foo\\ bar baz${syntax}`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const content = `${syntax}foo\nbar\nbaz${syntax}`
            const out = Parser.parse(content)
            expect(out).toMatchSnapshot()
        })

        describe('with nested', () => {
            test('delete', () => {
                const content = `${syntax}foo ~~bar~~ baz${syntax}`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('emphasis', () => {
                const content = `${syntax}foo *bar* baz${syntax}`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('inlineCode', () => {
                const content = `${syntax}foo \`bar\` baz${syntax}`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })

            test('strong', () => {
                const content = `${syntax}foo **bar** baz${syntax}`
                const out = Parser.parse(content)
                expect(out).toMatchSnapshot()
            })
        })
    })
}
