import Parser from '../'

describe('basic', () => {
    for (const syntax of ['*', '_']) {
        const doc = `${syntax}foo${syntax}`
        test(doc, () => {
            const { decorations, nodes } = Parser.parse(doc)
            expect(nodes).toEqual([
                {
                    from: 0,
                    to: 7,
                    type: 'paragraph',
                    marks: [{ from: 1, to: 6, type: 'emphasis' }],
                },
            ])
            expect(decorations).toEqual([
                { from: 1, to: 2, type: 'syntax' },
                { from: 5, to: 6, type: 'syntax' },
            ])
        })
    }
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '*~~foo~~*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [
                    { from: 2, to: 9, type: 'delete' },
                    { from: 1, to: 10, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 4, type: 'syntax' },
            { from: 7, to: 9, type: 'syntax' },
            { from: 1, to: 2, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '*`foo`*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 9,
                type: 'paragraph',
                marks: [
                    { from: 2, to: 7, type: 'inlineCode' },
                    { from: 1, to: 8, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 3, type: 'syntax' },
            { from: 6, to: 7, type: 'syntax' },
            { from: 1, to: 2, type: 'syntax' },
            { from: 7, to: 8, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '*__foo__*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [
                    { from: 2, to: 9, type: 'strong' },
                    { from: 1, to: 10, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 4, type: 'syntax' },
            { from: 7, to: 9, type: 'syntax' },
            { from: 1, to: 2, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
        ])
    })
})
