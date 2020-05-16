import Parser from '../'

const attrs = { checked: null, spread: false }

describe('unordered', () => {
    describe('basic', () => {
        const syntaxes = ['* ', '- ', '+ ']
        for (const syntax of syntaxes) {
            test(`single item with ${syntax}`, () => {
                const doc = `${syntax}foo`
                const out = Parser.parse(doc)
                expect(out.nodes).toEqual([
                    { from: 2, to: 9, type: 'paragraph', marks: [] },
                    { from: 1, to: 10, type: 'listItem', marks: [], attrs },
                    {
                        from: 0,
                        to: 11,
                        type: 'list',
                        marks: [],
                        attrs: {
                            ordered: false,
                            spread: false,
                            start: null,
                        },
                    },
                ])
                expect(out.decorations).toEqual([
                    { from: 3, to: 5, type: 'syntax' },
                ])
            })
        }

        for (const syntax of syntaxes) {
            test(`multiple items with ${syntax}`, () => {
                const doc = [
                    `${syntax}foo`,
                    `${syntax}bar`,
                    `${syntax}baz`,
                ].join('\n')
                const out = Parser.parse(doc)
                expect(out.nodes).toEqual([
                    { from: 2, to: 9, type: 'paragraph', marks: [] },
                    { from: 1, to: 10, type: 'listItem', marks: [], attrs },
                    { from: 11, to: 18, type: 'paragraph', marks: [] },
                    {
                        from: 10,
                        to: 19,
                        type: 'listItem',
                        marks: [],
                        attrs,
                    },
                    { from: 20, to: 27, type: 'paragraph', marks: [] },
                    {
                        from: 19,
                        to: 28,
                        type: 'listItem',
                        marks: [],
                        attrs,
                    },
                    {
                        from: 0,
                        to: 29,
                        type: 'list',
                        marks: [],
                        attrs: {
                            ordered: false,
                            spread: false,
                            start: null,
                        },
                    },
                ])
                expect(out.decorations).toEqual([
                    { from: 3, to: 5, type: 'syntax' },
                    { from: 12, to: 14, type: 'syntax' },
                    { from: 21, to: 23, type: 'syntax' },
                ])
            })
        }
    })

    describe('with nested', () => {
        test('emphasis', () => {
            const doc = '* foo *bar*'
            const out = Parser.parse(doc)
            expect(out.nodes).toEqual([
                {
                    from: 2,
                    to: 17,
                    type: 'paragraph',
                    marks: [{ from: 9, to: 16, type: 'emphasis' }],
                },
                { from: 1, to: 18, type: 'listItem', marks: [], attrs },
                {
                    from: 0,
                    to: 19,
                    type: 'list',
                    marks: [],
                    attrs: {
                        ordered: false,
                        spread: false,
                        start: null,
                    },
                },
            ])
            expect(out.decorations).toEqual([
                { from: 10, to: 11, type: 'syntax' },
                { from: 14, to: 15, type: 'syntax' },
                { from: 3, to: 5, type: 'syntax' },
            ])
        })
    })
})

describe('ordered', () => {
    describe('basic', () => {
        for (const syntax of ['0. ', '1. ', '99. ']) {
            test(`single item with ${syntax}`, () => {
                const doc = `${syntax}foo`
                const { decorations, nodes } = Parser.parse(doc)
                const start = parseInt(syntax)
                const num = `${start}`.length
                expect(nodes).toEqual([
                    { from: 2, to: 9 + num, type: 'paragraph', marks: [] },
                    {
                        from: 1,
                        to: 10 + num,
                        type: 'listItem',
                        marks: [],
                        attrs,
                    },
                    {
                        from: 0,
                        to: 11 + num,
                        type: 'list',
                        marks: [],
                        attrs: {
                            ordered: true,
                            spread: false,
                            start,
                        },
                    },
                ])
                expect(decorations).toEqual([
                    { from: 3, to: 5 + num, type: 'syntax' },
                ])
            })
        }

        test('multiple items starting with 0.', () => {
            const doc = ['0. foo', '1. bar', '2. baz'].join('\n')
            const out = Parser.parse(doc)
            expect(out.nodes).toEqual([
                { from: 2, to: 10, type: 'paragraph', marks: [] },
                { from: 1, to: 11, type: 'listItem', marks: [], attrs },
                { from: 12, to: 20, type: 'paragraph', marks: [] },
                { from: 11, to: 21, type: 'listItem', marks: [], attrs },
                { from: 22, to: 30, type: 'paragraph', marks: [] },
                { from: 21, to: 31, type: 'listItem', marks: [], attrs },
                {
                    from: 0,
                    to: 32,
                    type: 'list',
                    marks: [],
                    attrs: {
                        ordered: true,
                        spread: false,
                        start: 0,
                    },
                },
            ])
            expect(out.decorations).toEqual([
                { from: 3, to: 6, type: 'syntax' },
                { from: 13, to: 16, type: 'syntax' },
                { from: 23, to: 26, type: 'syntax' },
            ])
        })

        test('multiple items starting with 99.', () => {
            const doc = ['99. foo', '100. bar', '101. baz'].join('\n')
            const out = Parser.parse(doc)
            expect(out.nodes).toEqual([
                { from: 2, to: 11, type: 'paragraph', marks: [] },
                { from: 1, to: 12, type: 'listItem', marks: [], attrs },
                { from: 13, to: 23, type: 'paragraph', marks: [] },
                { from: 12, to: 24, type: 'listItem', marks: [], attrs },
                { from: 25, to: 35, type: 'paragraph', marks: [] },
                { from: 24, to: 36, type: 'listItem', marks: [], attrs },
                {
                    from: 0,
                    to: 37,
                    type: 'list',
                    marks: [],
                    attrs: {
                        ordered: true,
                        spread: false,
                        start: 99,
                    },
                },
            ])
            expect(out.decorations).toEqual([
                { from: 3, to: 7, type: 'syntax' },
                { from: 14, to: 19, type: 'syntax' },
                { from: 26, to: 31, type: 'syntax' },
            ])
        })

        test('multiple items with mismatched numbers', () => {
            const doc = ['7. foo', '10. bar', '3. baz'].join('\n')
            const out = Parser.parse(doc)
            expect(out.nodes).toEqual([
                { from: 2, to: 10, type: 'paragraph', marks: [] },
                { from: 1, to: 11, type: 'listItem', marks: [], attrs },
                { from: 12, to: 20, type: 'paragraph', marks: [] },
                { from: 11, to: 21, type: 'listItem', marks: [], attrs },
                { from: 22, to: 30, type: 'paragraph', marks: [] },
                { from: 21, to: 31, type: 'listItem', marks: [], attrs },
                {
                    from: 0,
                    to: 32,
                    type: 'list',
                    marks: [],
                    attrs: {
                        ordered: true,
                        spread: false,
                        start: 7,
                    },
                },
            ])
            expect(out.decorations).toEqual([
                { from: 3, to: 6, type: 'syntax' },
                { from: 13, to: 16, type: 'syntax' },
                { from: 23, to: 26, type: 'syntax' },
            ])
        })
    })

    describe('with nested', () => {
        test('emphasis', () => {
            const doc = '0. foo *bar*'
            const out = Parser.parse(doc)
            expect(out.nodes).toEqual([
                {
                    from: 2,
                    to: 18,
                    type: 'paragraph',
                    marks: [{ from: 10, to: 17, type: 'emphasis' }],
                },
                { from: 1, to: 19, type: 'listItem', marks: [], attrs },
                {
                    from: 0,
                    to: 20,
                    type: 'list',
                    marks: [],
                    attrs: {
                        ordered: true,
                        spread: false,
                        start: 0,
                    },
                },
            ])
            expect(out.decorations).toEqual([
                { from: 11, to: 12, type: 'syntax' },
                { from: 15, to: 16, type: 'syntax' },
                { from: 3, to: 6, type: 'syntax' },
            ])
        })
    })
})

describe('spread', () => {
    test('unordered', () => {
        const doc = ['* foo', '', '* bar', '', '* baz'].join('\n')
        const out = Parser.parse(doc)
        expect(out.nodes).toEqual([
            { from: 2, to: 9, type: 'paragraph', marks: [] },
            { from: 1, to: 10, type: 'listItem', marks: [], attrs },
            { from: 11, to: 18, type: 'paragraph', marks: [] },
            {
                from: 10,
                to: 19,
                type: 'listItem',
                marks: [],
                attrs,
            },
            { from: 20, to: 27, type: 'paragraph', marks: [] },
            {
                from: 19,
                to: 28,
                type: 'listItem',
                marks: [],
                attrs,
            },
            {
                from: 0,
                to: 29,
                type: 'list',
                marks: [],
                attrs: {
                    ordered: false,
                    spread: true,
                    start: null,
                },
            },
        ])
        expect(out.decorations).toEqual([
            { from: 3, to: 5, type: 'syntax' },
            { from: 12, to: 14, type: 'syntax' },
            { from: 21, to: 23, type: 'syntax' },
        ])
    })

    test('ordered', () => {
        const doc = ['0. foo', '', '1. bar', '', '2. baz'].join('\n')
        const out = Parser.parse(doc)
        expect(out.nodes).toEqual([
            { from: 2, to: 10, type: 'paragraph', marks: [] },
            { from: 1, to: 11, type: 'listItem', marks: [], attrs },
            { from: 12, to: 20, type: 'paragraph', marks: [] },
            { from: 11, to: 21, type: 'listItem', marks: [], attrs },
            { from: 22, to: 30, type: 'paragraph', marks: [] },
            { from: 21, to: 31, type: 'listItem', marks: [], attrs },
            {
                from: 0,
                to: 32,
                type: 'list',
                marks: [],
                attrs: {
                    ordered: true,
                    spread: true,
                    start: 0,
                },
            },
        ])
        expect(out.decorations).toEqual([
            { from: 3, to: 6, type: 'syntax' },
            { from: 13, to: 16, type: 'syntax' },
            { from: 23, to: 26, type: 'syntax' },
        ])
    })
})

describe('tasks', () => {
    test('unordered', () => {
        const doc = ['* [ ] foo', '* [x] bar'].join('\n')
        const out = Parser.parse(doc)
        expect(out.nodes).toEqual([
            { from: 2, to: 13, type: 'paragraph', marks: [] },
            {
                from: 1,
                to: 14,
                type: 'listItem',
                marks: [],
                attrs: { ...attrs, checked: false },
            },
            { from: 15, to: 26, type: 'paragraph', marks: [] },
            {
                from: 14,
                to: 27,
                type: 'listItem',
                marks: [],
                attrs: { ...attrs, checked: true },
            },
            {
                from: 0,
                to: 28,
                type: 'list',
                marks: [],
                attrs: {
                    ordered: false,
                    spread: false,
                    start: null,
                },
            },
        ])
        expect(out.decorations).toEqual([
            { from: 3, to: 9, type: 'syntax' },
            { from: 16, to: 22, type: 'syntax' },
        ])
    })

    test('ordered', () => {
        const doc = ['0. [ ] foo', '1. [x] bar'].join('\n')
        const out = Parser.parse(doc)
        expect(out.nodes).toEqual([
            { from: 2, to: 14, type: 'paragraph', marks: [] },
            {
                from: 1,
                to: 15,
                type: 'listItem',
                marks: [],
                attrs: { ...attrs, checked: false },
            },
            { from: 16, to: 28, type: 'paragraph', marks: [] },
            {
                from: 15,
                to: 29,
                type: 'listItem',
                marks: [],
                attrs: { ...attrs, checked: true },
            },

            {
                from: 0,
                to: 30,
                type: 'list',
                marks: [],
                attrs: {
                    ordered: true,
                    spread: false,
                    start: 0,
                },
            },
        ])
        expect(out.decorations).toEqual([
            { from: 3, to: 10, type: 'syntax' },
            { from: 17, to: 24, type: 'syntax' },
        ])
    })
})
