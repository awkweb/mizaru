import Parser from '../'

describe('basic', () => {
    for (const syntax of ['# ', '## ', '### ', '#### ', '##### ', '###### ']) {
        const doc = [`${syntax}foo`].join('\n')
        test(doc, () => {
            const { decorations, nodes } = Parser.parse(doc)
            expect(nodes).toEqual([
                {
                    from: 0,
                    to: doc.length + 2,
                    type: 'heading',
                    marks: [],
                    attrs: {
                        level: syntax.length - 1,
                    },
                },
            ])
            expect(decorations).toEqual([
                { from: 1, to: syntax.length + 1, type: 'syntax' },
            ])
        })
    }
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '# foo ~~bar~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'delete' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 9, type: 'syntax' },
            { from: 12, to: 14, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '# foo *bar*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'heading',
                marks: [{ from: 7, to: 12, type: 'emphasis' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 8, type: 'syntax' },
            { from: 11, to: 12, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '# foo `bar`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'heading',
                marks: [{ from: 7, to: 12, type: 'inlineCode' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 8, type: 'syntax' },
            { from: 11, to: 12, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '# foo **bar**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'strong' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 9, type: 'syntax' },
            { from: 12, to: 14, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })
})

describe('edge cases', () => {
    const doc = '#foo'
    test(`"${doc}"`, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 6,
                type: 'paragraph',
                marks: [],
            },
        ])
        expect(decorations).toEqual([])
    })

    const doc2 = '#foo  '
    test(`"${doc2}"`, () => {})

    const doc3 = '   #foo'
    test(`"${doc3}"`, () => {})

    const doc4 = '   #foo  '
    test(`"${doc4}"`, () => {})

    const doc5 = '# foo  '
    test(`"${doc5}"`, () => {})

    const doc6 = '   # foo'
    test(`"${doc6}"`, () => {})

    const doc7 = '   #foo  '
    test(`"${doc7}"`, () => {})

    const doc8 = '#    foo'
    test(`"${doc8}"`, () => {})

    const doc9 = '#    foo  '
    test(`"${doc9}"`, () => {})

    const doc10 = '   #    foo'
    test(`"${doc10}"`, () => {})

    const doc11 = '   #    foo   '
    test(`"${doc11}"`, () => {})
})
