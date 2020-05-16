import Parser from '../'

describe('basic', () => {
    for (const syntax of ['**', '__']) {
        const doc = `${syntax}foo${syntax}`
        test(doc, () => {
            const { decorations, nodes } = Parser.parse(doc)
            expect(nodes).toEqual([
                {
                    from: 0,
                    to: 11,
                    type: 'paragraph',
                    marks: [{ from: 1, to: 10, type: 'strong' }],
                },
            ])
            expect(decorations).toEqual([
                { from: 2, to: 4, type: 'syntax' },
                { from: 7, to: 9, type: 'syntax' },
            ])
        })
    }
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '**~~foo~~**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 17,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 13, type: 'delete' },
                    { from: 1, to: 16, type: 'strong' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 5, to: 7, type: 'syntax' },
            { from: 10, to: 12, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
            { from: 13, to: 15, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '***foo***'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 11, type: 'emphasis' },
                    { from: 1, to: 14, type: 'strong' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 5, to: 6, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
            { from: 11, to: 13, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '**`foo`**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 11, type: 'inlineCode' },
                    { from: 1, to: 14, type: 'strong' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 5, to: 6, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
            { from: 11, to: 13, type: 'syntax' },
        ])
    })
})
