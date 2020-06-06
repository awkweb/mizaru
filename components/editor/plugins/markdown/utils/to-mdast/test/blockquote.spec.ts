import toMDAST from '../'

test.only('empty', () => {
    const mdast = toMDAST('> f')
    console.log(JSON.stringify(mdast, null, 4))
    // expect(mdast).toMatchSnapshot()
})

for (const syntax of ['>', '> ']) {
    describe(`"${syntax}"`, () => {
        test('empty', () => {
            const mdast = toMDAST(`${syntax}`)
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

            test('inner', () => {
                const mdast = toMDAST(`${syntax}   foo bar baz`)
                expect(mdast).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const mdast = toMDAST(`   ${syntax}   foo bar baz`)
                expect(mdast).toMatchSnapshot()
            })
        })
    })
}
