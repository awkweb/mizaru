import { Lexer } from 'marked'

import Parser from '../'

test('text', () => {
    const doc = 'foo'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([{ from: 0, to: 5, type: 'paragraph', marks: [] }])
    expect(decorations).toEqual([])
})

test('strong', () => {
    /*
     *  0   1 2 3 4 5 6 7 8    9
     *   <p> * * f o o * * </p>
     */
    const doc = '**foo**'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 9,
            type: 'paragraph',
            marks: [{ from: 1, to: 8, type: 'strong' }],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 6, to: 8 },
    ])
})

test('em', () => {
    /*
     *  0   1 2 3 4 5 6    7
     *   <p> * f o o * </p>
     */
    const doc = '*foo*'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 7,
            type: 'paragraph',
            marks: [{ from: 1, to: 6, type: 'em' }],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 5, to: 6 },
    ])
})

test('del', () => {
    const doc = '~foo~'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 7,
            type: 'paragraph',
            marks: [{ from: 1, to: 6, type: 'del' }],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 6, type: 'syntax' },
    ])
})

test('codespan', () => {
    const doc = '`foo`'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 7,
            type: 'paragraph',
            marks: [{ from: 1, to: 6, type: 'codespan' }],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 5, to: 6 },
    ])
})

test('strong with nested em', () => {
    /*
     *  0   1 2 3 4 5 6 7 8 9 0 1 2 3 4    5
     *   <p> * * f o o   * b a r * * * </p>
     */
    const doc = '**foo *bar***'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 15,
            type: 'paragraph',
            marks: [
                { from: 7, to: 12, type: 'em' },
                { from: 1, to: 14, type: 'strong' },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 7, to: 8 },
        { from: 11, to: 12 },
        { from: 1, to: 3 },
        { from: 12, to: 14 },
    ])
})

test('em with nested strong', () => {
    const doc = '*foo **bar***'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 15,
            type: 'paragraph',
            marks: [
                { from: 6, to: 13, type: 'strong' },
                { from: 1, to: 14, type: 'em' },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 6, to: 8 },
        { from: 11, to: 13 },
        { from: 1, to: 2 },
        { from: 13, to: 14 },
    ])
})

test('deeply nested strong', () => {
    /*
     *  0   1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2    3
     *   <p> * * f o o   * b a r   * * b a z * * * * * </p>
     */
    const doc = '**foo *bar **baz*****'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 23,
            type: 'paragraph',
            marks: [
                { from: 12, to: 19, type: 'strong' },
                { from: 7, to: 20, type: 'em' },
                { from: 1, to: 22, type: 'strong' },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 12, to: 14 },
        { from: 17, to: 19 },
        { from: 7, to: 8 },
        { from: 19, to: 20 },
        { from: 1, to: 3 },
        { from: 20, to: 22 },
    ])
})

test('strong inside h1', () => {
    const doc = '# foo **bar**'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 15,
            type: 'heading',
            marks: [{ from: 7, to: 14, type: 'strong' }],
            attrs: { level: 1 },
        },
    ])
    expect(decorations).toEqual([
        { from: 0, to: 3 },
        { from: 7, to: 9 },
        { from: 12, to: 14 },
    ])
})

test('em inside h4', () => {
    const doc = '#### foo *bar* baz'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 20,
            type: 'heading',
            marks: [{ from: 10, to: 15, type: 'em' }],
            attrs: { level: 4 },
        },
    ])
    expect(decorations).toEqual([
        { from: 0, to: 6 },
        { from: 10, to: 11 },
        { from: 14, to: 15 },
    ])
})

test('link', () => {
    const doc = '[foo](https://example.com)'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 28,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 27,
                    type: 'link',
                    attrs: { href: 'https://example.com', title: null },
                },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 27, type: 'syntax' },
    ])
})

test('link with title', () => {
    const doc = '[foo](https://example.com "bar")'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 34,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 33,
                    type: 'link',
                    attrs: { href: 'https://example.com', title: 'bar' },
                },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 33, type: 'syntax' },
    ])
})

test('link without href', () => {
    const doc = '[foo]()'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 9,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 8,
                    type: 'link',
                    attrs: { href: '', title: null },
                },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 8, type: 'syntax' },
    ])
})

test('gfm url', () => {
    const doc = 'https://example.com'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 21,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 20,
                    type: 'link',
                    attrs: { href: 'https://example.com', title: undefined },
                },
            ],
        },
    ])
    expect(decorations).toEqual([{ from: 1, to: 20, type: 'preview' }])
})

test('gfm email', () => {
    const doc = 'foo@example.com'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 17,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 16,
                    type: 'link',
                    attrs: {
                        href: nodes[0].marks[0].attrs?.href,
                        title: undefined,
                    },
                },
            ],
        },
    ])
    expect(decorations).toEqual([{ from: 1, to: 16, type: 'preview' }])
})

test('autolink url', () => {
    const doc = '<https://example.com>'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 23,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 22,
                    type: 'link',
                    attrs: {
                        href: 'https://example.com',
                        title: undefined,
                    },
                },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 21, type: 'preview' },
        { from: 21, to: 22, type: 'syntax' },
    ])
})

test('autolink email', () => {
    const doc = '<foo@example.com>'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 19,
            type: 'paragraph',
            marks: [
                {
                    from: 1,
                    to: 18,
                    type: 'link',
                    attrs: {
                        href: nodes[0].marks[0].attrs?.href,
                        title: undefined,
                    },
                },
            ],
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 17, type: 'preview' },
        { from: 17, to: 18, type: 'syntax' },
    ])
})

test('h1', () => {
    const doc = '# foo'
    const tokens = Lexer.lex(doc)
    const { nodes, decorations } = Parser.parse(tokens)
    expect(nodes).toEqual([
        {
            from: 0,
            to: 7,
            type: 'heading',
            marks: [],
            attrs: { level: 1 },
        },
    ])
    expect(decorations).toEqual([{ from: 0, to: 3 }])
})
