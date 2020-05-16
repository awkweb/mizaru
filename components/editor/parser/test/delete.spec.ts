import Parser from '../'

describe('basic', () => {
    const doc = '~~foo~~'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 11,
                type: 'paragraph',
                marks: [{ from: 1, to: 10, type: 'delete' }],
            },
        ])
        expect(decorations).toEqual([
            { from: 2, to: 4, type: 'syntax' },
            { from: 7, to: 9, type: 'syntax' },
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
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 11, type: 'emphasis' },
                    { from: 1, to: 14, type: 'delete' },
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
        const doc = '~~`foo`~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 11, type: 'inlineCode' },
                    { from: 1, to: 14, type: 'delete' },
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

    test('strong', () => {
        const doc = '~~**foo**~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 17,
                type: 'paragraph',
                marks: [
                    { from: 4, to: 13, type: 'strong' },
                    { from: 1, to: 16, type: 'delete' },
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
})
