import Parser from '../'

describe('basic', () => {
    const doc = '`foo`'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 7,
                type: 'paragraph',
                marks: [{ from: 1, to: 6, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 1, to: 2, type: 'syntax' },
            { from: 5, to: 6, type: 'syntax' },
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
                to: 11,
                type: 'paragraph',
                marks: [{ from: 1, to: 10, type: 'inlineCode' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 1, to: 2, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '`*foo*`'
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
            { from: 1, to: 2, type: 'syntax' },
            { from: 7, to: 8, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '`**foo**`'
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
            { from: 1, to: 2, type: 'syntax' },
            { from: 9, to: 10, type: 'syntax' },
        ])
    })
})
