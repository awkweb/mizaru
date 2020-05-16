import Parser from '../'

describe('basic', () => {
    for (const syntax of ['*', '_']) {
        const doc = `${syntax}foo${syntax}`
        test(doc, () => {
            const { decorations, nodes } = Parser.parse(doc)
            expect(nodes).toEqual([
                {
                    from: 0,
                    to: 9,
                    type: 'paragraph',
                    marks: [{ from: 1, to: 8, type: 'emphasis' }],
                },
            ])
            expect(decorations).toEqual([
                { from: 2, to: 3, type: 'syntax' },
                { from: 6, to: 7, type: 'syntax' },
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
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 12, type: 'delete' },
                    { from: 1, to: 14, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 4, to: 6, type: 'syntax' },
            { from: 9, to: 11, type: 'syntax' },
            { from: 2, to: 3, type: 'syntax' },
            { from: 12, to: 13, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '*`foo`*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 10, type: 'inlineCode' },
                    { from: 1, to: 12, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 4, to: 5, type: 'syntax' },
            { from: 8, to: 9, type: 'syntax' },
            { from: 2, to: 3, type: 'syntax' },
            { from: 10, to: 11, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '*__foo__*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 12, type: 'strong' },
                    { from: 1, to: 14, type: 'emphasis' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 4, to: 6, type: 'syntax' },
            { from: 9, to: 11, type: 'syntax' },
            { from: 2, to: 3, type: 'syntax' },
            { from: 12, to: 13, type: 'syntax' },
        ])
    })
})
