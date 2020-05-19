import Parser from '../'

describe('basic', () => {
    for (const syntax of ['# ', '## ', '### ', '#### ', '##### ', '###### ']) {
        const doc = `${syntax}foo`
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
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'delete' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 9, type: 'syntax' },
            { from: 12, to: 14, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('emphasis', () => {
        const doc = '# foo *bar*'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'heading',
                marks: [{ from: 7, to: 12, type: 'emphasis' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 8, type: 'syntax' },
            { from: 11, to: 12, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('inlineCode', () => {
        const doc = '# foo `bar`'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 13,
                type: 'heading',
                marks: [{ from: 7, to: 12, type: 'inlineCode' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 8, type: 'syntax' },
            { from: 11, to: 12, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })

    test('strong', () => {
        const doc = '# foo **bar**'
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            {
                from: 0,
                to: 15,
                type: 'heading',
                marks: [{ from: 7, to: 14, type: 'strong' }],
                attrs: {
                    level: 1,
                },
            },
        ])
        expect(decorations).toEqual([
            { from: 7, to: 9, type: 'syntax' },
            { from: 12, to: 14, type: 'syntax' },
            { from: 1, to: 3, type: 'syntax' },
        ])
    })
})

describe('edge cases', () => {
    const content = 'foo'
    const contentLength = content.length
    const whiteSpace = '   '
    const whiteSpaceLength = whiteSpace.length

    for (const syntax of ['#', '##', '###', '####', '#####', '######']) {
        const syntaxLength = syntax.length
        const attrs = {
            level: syntaxLength,
        }
        const decorationEnd = syntaxLength + 2

        describe(syntax, () => {
            const doc = `${syntax}${content}`
            test(`case 01: "${doc}"`, () => {
                const { decorations, nodes } = Parser.parse(doc)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: syntaxLength + contentLength + 2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc2 = `${syntax}${content}${whiteSpace}`
            test(`case 02: "${doc2}"`, () => {
                const { decorations, nodes } = Parser.parse(doc2)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: syntaxLength + contentLength + whiteSpaceLength + 2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc3 = `${whiteSpace}${syntax}${content}`
            test(`case 03: "${doc3}"`, () => {
                const { decorations, nodes } = Parser.parse(doc3)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: whiteSpaceLength + syntaxLength + contentLength + 2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc4 = `${whiteSpace}${syntax}${content}${whiteSpace}`
            test(`case 04: "${doc4}"`, () => {
                const { decorations, nodes } = Parser.parse(doc4)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            contentLength +
                            whiteSpaceLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc5 = `${syntax} ${content}${whiteSpace}`
            test(`case 05: "${doc5}"`, () => {
                const { decorations, nodes } = Parser.parse(doc5)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            syntaxLength +
                            1 +
                            contentLength +
                            whiteSpaceLength +
                            2,
                        type: 'heading',
                        marks: [],
                        attrs,
                    },
                ])
                expect(decorations).toEqual([
                    { from: 1, to: decorationEnd, type: 'syntax' },
                ])
            })

            const doc6 = `${whiteSpace}${syntax} ${content}`
            test(`case 06: "${doc6}"`, () => {
                const { decorations, nodes } = Parser.parse(doc6)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            contentLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc7 = `${whiteSpace}${syntax} ${content}${whiteSpace}`
            test(`case 07: "${doc7}"`, () => {
                const { decorations, nodes } = Parser.parse(doc7)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            contentLength +
                            whiteSpaceLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc8 = `${syntax} ${whiteSpace}${content}`
            test(`case 08: "${doc8}"`, () => {
                const { decorations, nodes } = Parser.parse(doc8)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            contentLength +
                            2,
                        type: 'heading',
                        marks: [],
                        attrs,
                    },
                ])
                expect(decorations).toEqual([
                    { from: 1, to: decorationEnd, type: 'syntax' },
                ])
            })

            const doc9 = `${syntax} ${whiteSpace}${content}${whiteSpace}`
            test(`case 09: "${doc9}"`, () => {
                const { decorations, nodes } = Parser.parse(doc9)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            contentLength +
                            whiteSpaceLength +
                            2,
                        type: 'heading',
                        marks: [],
                        attrs,
                    },
                ])
                expect(decorations).toEqual([
                    { from: 1, to: decorationEnd, type: 'syntax' },
                ])
            })

            const doc10 = `${whiteSpace}${syntax} ${whiteSpace}${content}`
            test(`case 10: "${doc10}"`, () => {
                const { decorations, nodes } = Parser.parse(doc10)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            contentLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc11 = `${whiteSpace}${syntax} ${whiteSpace}${content}${whiteSpace}`
            test(`case 11: "${doc11}"`, () => {
                const { decorations, nodes } = Parser.parse(doc11)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            contentLength +
                            whiteSpaceLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc12 = `${syntax} ${whiteSpace}`
            test(`case 12: "${doc12}"`, () => {
                const { decorations, nodes } = Parser.parse(doc12)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: syntaxLength + 1 + whiteSpaceLength + 2,
                        type: 'heading',
                        marks: [],
                        attrs,
                    },
                ])
                expect(decorations).toEqual([
                    { from: 1, to: decorationEnd, type: 'syntax' },
                ])
            })

            const doc13 = `${whiteSpace}${syntax}`
            test(`case 13: "${doc13}"`, () => {
                const { decorations, nodes } = Parser.parse(doc13)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: whiteSpaceLength + syntaxLength + 2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc14 = `${whiteSpace}${syntax} ${whiteSpace}`
            test(`case 14: "${doc14}"`, () => {
                const { decorations, nodes } = Parser.parse(doc14)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc15 = `${whiteSpace}${syntax} *${content}*`
            test(`case 15: "${doc15}"`, () => {
                const { decorations, nodes } = Parser.parse(doc15)
                const markStart = whiteSpaceLength + syntaxLength + 2
                const markEnd = markStart + contentLength + 2
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            contentLength +
                            2 +
                            2,
                        type: 'paragraph',
                        marks: [
                            {
                                from: markStart,
                                to: markEnd,
                                type: 'emphasis',
                            },
                        ],
                    },
                ])
                expect(decorations).toEqual([
                    { from: markStart, to: markStart + 1, type: 'syntax' },
                    { from: markEnd - 1, to: markEnd, type: 'syntax' },
                ])
            })

            const doc16 = `${syntax} *${content}*${whiteSpace}`
            test(`case 16: "${doc16}"`, () => {
                const { decorations, nodes } = Parser.parse(doc16)
                const markStart = syntaxLength + 2
                const markEnd = markStart + contentLength + 2
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            syntaxLength +
                            1 +
                            contentLength +
                            2 +
                            whiteSpaceLength +
                            2,
                        type: 'heading',
                        marks: [
                            {
                                from: markStart,
                                to: markEnd,
                                type: 'emphasis',
                            },
                        ],
                        attrs,
                    },
                ])
                expect(decorations).toEqual([
                    { from: markStart, to: markStart + 1, type: 'syntax' },
                    { from: markEnd - 1, to: markEnd, type: 'syntax' },
                    { from: 1, to: syntaxLength + 2, type: 'syntax' },
                ])
            })

            const doc17 = `${syntax}`
            test(`case 17: "${doc17}"`, () => {
                const { decorations, nodes } = Parser.parse(doc17)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to: syntaxLength + 2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })

            const doc18 = `${whiteSpace}${syntax} ${whiteSpace}${content} ${content}`
            test(`case 18: "${doc18}"`, () => {
                const { decorations, nodes } = Parser.parse(doc18)
                expect(nodes).toEqual([
                    {
                        from: 0,
                        to:
                            whiteSpaceLength +
                            syntaxLength +
                            1 +
                            whiteSpaceLength +
                            contentLength +
                            1 +
                            contentLength +
                            2,
                        type: 'paragraph',
                        marks: [],
                    },
                ])
                expect(decorations).toEqual([])
            })
        })
    }
})
