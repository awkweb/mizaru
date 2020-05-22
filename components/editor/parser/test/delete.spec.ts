import Parser from '../'

describe('basic', () => {
    const doc = '~~foo~~'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 9,
                type: 'paragraph',
                marks: [{ from: 1, to: 8, type: 'delete' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 1, to: 3, type: 'syntax' },
            { from: 6, to: 8, type: 'syntax' },
        ])
    })
})

describe('with nested', () => {
    test('emphasis', () => {
        const doc = '~~*foo*~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 8, type: 'emphasis' },
                    { from: 1, to: 10, type: 'delete' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 3, to: 4, type: 'syntax' },
            { from: 7, to: 8, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
            { from: 8, to: 10, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '~~`foo`~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 8, type: 'inlineCode' },
                    { from: 1, to: 10, type: 'delete' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 3, to: 4, type: 'syntax' },
            { from: 7, to: 8, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
            { from: 8, to: 10, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '~~**foo**~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'paragraph',
                marks: [
                    { from: 3, to: 10, type: 'strong' },
                    { from: 1, to: 12, type: 'delete' },
                ],
            },
        ])
        expect(decorations).toEqual([
            { from: 3, to: 5, type: 'syntax' },
            { from: 8, to: 10, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
            { from: 10, to: 12, type: 'syntax' },
        ])
    })
})
