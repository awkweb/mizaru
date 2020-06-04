import toMDAST from '../'

for (const syntax of ['**', '__']) {
    describe(syntax, () => {
        test('single word', () => {
            const mdast = toMDAST(`${syntax}foo${syntax}`)
            expect(mdast).toMatchSnapshot()
        })

        test('multiple words', () => {
            const mdast = toMDAST(`${syntax}foo bar baz${syntax}`)
            expect(mdast).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const mdast = toMDAST(`${syntax}foo\nbar\nbaz${syntax}`)
            expect(mdast).toMatchSnapshot()
        })

        describe('nested', () => {
            test('emphasis', () => {
                const mdast = toMDAST(`${syntax}foo *bar* baz${syntax}`)
                expect(mdast).toMatchSnapshot()
            })

            test('strong', () => {
                const mdast = toMDAST(`${syntax}foo **bar** baz${syntax}`)
                expect(mdast).toMatchSnapshot()
            })
        })
    })
}
