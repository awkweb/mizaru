import Parser from '../'

describe('basic', () => {
    const doc = '`foo`'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 9,
                type: 'paragraph',
                marks: [{ from: 1, to: 8, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 3, type: 'syntax' },
            { from: 6, to: 7, type: 'syntax' },
        ])
    })
})

describe('cannot nest', () => {
    test('delete', () => {
        const doc = '`~~foo~~`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'paragraph',
                marks: [{ from: 1, to: 12, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 3, type: 'syntax' },
            { from: 10, to: 11, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '`*foo*`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [{ from: 1, to: 10, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 3, type: 'syntax' },
            { from: 8, to: 9, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '`**foo**`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'paragraph',
                marks: [{ from: 1, to: 12, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 3, type: 'syntax' },
            { from: 10, to: 11, type: 'syntax' },
        ])
    })
})
