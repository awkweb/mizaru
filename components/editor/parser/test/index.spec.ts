import Parser from '../'

describe('text', () => {
    let doc = ['foo'].join('\n')
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            { from: 0, to: 5, type: 'paragraph', marks: [] },
        ])
        expect(decorations).toEqual([])
    })

    test('<empty>', () => {
        const { decorations, nodes } = Parser.parse('')
        expect(nodes).toEqual([])
        expect(decorations).toEqual([])
    })
})

describe('delete', () => {
    describe('basic', () => {
        const doc = ['~~foo~~'].join('\n')
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
            const doc = ['~~*foo*~~'].join('\n')
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
            const doc = ['~~`foo`~~'].join('\n')
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
            const doc = ['~~**foo**~~'].join('\n')
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
})

describe('emphasis', () => {
    describe('basic', () => {
        for (const syntax of ['*', '_']) {
            const doc = [`${syntax}foo${syntax}`].join('\n')
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
            const doc = ['*~~foo~~*'].join('\n')
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
            const doc = ['*`foo`*'].join('\n')
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
            const doc = ['*__foo__*'].join('\n')
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
})

describe('inlineCode', () => {
    describe('basic', () => {
        const doc = ['`foo`'].join('\n')
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
            const doc = ['`~~foo~~`'].join('\n')
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
            const doc = ['`*foo*`'].join('\n')
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
            const doc = ['`**foo**`'].join('\n')
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
})

describe('link', () => {
    describe('basic', () => {
        const doc = ['[foo]()'].join('\n')
        test(doc, () => {
            const { decorations, nodes } = Parser.parse(doc)
        })

        const doc2 = ['[foo](https://example.com)'].join('\n')
        test(doc2, () => {
            const { decorations, nodes } = Parser.parse(doc2)
        })

        const doc3 = ['[foo](https://example.com "bar")'].join('\n')
        test(doc3, () => {
            const { decorations, nodes } = Parser.parse(doc3)
        })

        const doc4 = ['<https://example.com>'].join('\n')
        test(doc4, () => {
            const { decorations, nodes } = Parser.parse(doc4)
        })

        const doc5 = ['https://example.com'].join('\n')
        test(doc5, () => {
            const { decorations, nodes } = Parser.parse(doc5)
        })

        const doc6 = ['foo@example.com'].join('\n')
        test(doc6, () => {
            const { decorations, nodes } = Parser.parse(doc6)
        })
    })
})

describe('strong', () => {
    describe('basic', () => {
        for (const syntax of ['**', '__']) {
            const doc = [`${syntax}foo${syntax}`].join('\n')
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
            const doc = ['**~~foo~~**'].join('\n')
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
            const doc = ['***foo***'].join('\n')
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
            const doc = ['**`foo`**'].join('\n')
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
})

describe('blockquote', () => {
    describe('basic', () => {
        const doc = ['> foo'].join('\n')
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
            const doc = ['> foo ~~bar~~'].join('\n')
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
            const doc = ['> foo *bar*'].join('\n')
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
            const doc = ['> foo `bar`'].join('\n')
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
            const doc = ['> foo **bar**'].join('\n')
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
})

describe('heading', () => {
    describe('basic', () => {
        for (const syntax of [
            '# ',
            '## ',
            '### ',
            '#### ',
            '##### ',
            '###### ',
        ]) {
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
            const doc = ['# foo ~~bar~~'].join('\n')
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
            const doc = ['# foo *bar*'].join('\n')
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
            const doc = ['# foo `bar`'].join('\n')
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
            const doc = ['# foo **bar**'].join('\n')
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
})

describe('list', () => {
    const attrs = { checked: null, spread: false }

    describe('unordered', () => {
        describe('basic', () => {
            const syntaxes = ['* ', '- ', '+ ']
            for (const syntax of syntaxes) {
                test(`single item with ${syntax}`, () => {
                    const doc = [`${syntax}foo`].join('\n')
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
                const doc = ['* foo *bar*'].join('\n')
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
                    const doc = [`${syntax}foo`].join('\n')
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
                const doc = ['0. foo *bar*'].join('\n')
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
})
