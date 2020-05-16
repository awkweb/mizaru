import Parser from '../'

describe('basic', () => {
    const doc = '> foo'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 1,
                to: 8,
                type: 'paragraph',
                marks: [],
            },
            {
                from: 0,
                to: 9,
                type: 'blockquote',
                marks: [],
            },
        ])
        expect(decorations).toEqual([{ from: 2, to: 4, type: 'syntax' }])
    })
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '> foo ~~bar~~'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 1,
                to: 18,
                type: 'paragraph',
                marks: [{ from: 8, to: 17, type: 'delete' }],
            },
            {
                from: 0,
                to: 19,
                type: 'blockquote',
                marks: [],
            },
        ])
        expect(decorations).toEqual([
            { from: 9, to: 11, type: 'syntax' },
            { from: 14, to: 16, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '> foo *bar*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 1,
                to: 16,
                type: 'paragraph',
                marks: [{ from: 8, to: 15, type: 'emphasis' }],
            },
            {
                from: 0,
                to: 17,
                type: 'blockquote',
                marks: [],
            },
        ])
        expect(decorations).toEqual([
            { from: 9, to: 10, type: 'syntax' },
            { from: 13, to: 14, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '> foo `bar`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 1,
                to: 16,
                type: 'paragraph',
                marks: [{ from: 8, to: 15, type: 'inlineCode' }],
            },
            {
                from: 0,
                to: 17,
                type: 'blockquote',
                marks: [],
            },
        ])
        expect(decorations).toEqual([
            { from: 9, to: 10, type: 'syntax' },
            { from: 13, to: 14, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '> foo **bar**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 1,
                to: 18,
                type: 'paragraph',
                marks: [{ from: 8, to: 17, type: 'strong' }],
            },
            {
                from: 0,
                to: 19,
                type: 'blockquote',
                marks: [],
            },
        ])
        expect(decorations).toEqual([
            { from: 9, to: 11, type: 'syntax' },
            { from: 14, to: 16, type: 'syntax' },
            { from: 2, to: 4, type: 'syntax' },
        ])
    })
})
