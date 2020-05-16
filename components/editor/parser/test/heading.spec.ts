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
                to: 17,
                type: 'heading',
                marks: [{ from: 7, to: 16, type: 'delete' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 8, to: 10, type: 'syntax' },
            { from: 13, to: 15, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '# foo *bar*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'emphasis' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 8, to: 9, type: 'syntax' },
            { from: 12, to: 13, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '# foo `bar`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'inlineCode' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 8, to: 9, type: 'syntax' },
            { from: 12, to: 13, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '# foo **bar**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 17,
                type: 'heading',
                marks: [{ from: 7, to: 16, type: 'strong' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 8, to: 10, type: 'syntax' },
            { from: 13, to: 15, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })
})
