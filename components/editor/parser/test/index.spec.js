import { Lexer } from 'marked'

import Parser from '../'

test('text', () => {
    const doc = 'foo'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([])
    expect(decorations).toEqual([])
})

test('strong', () => {
    const doc = '**foo**'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 8, type: 'strong' }])
    expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 6, to: 8 },
    ])
})

test('em', () => {
    const doc = '*foo*'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 6, type: 'em' }])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 5, to: 6 },
    ])
})

test('del', () => {
    const doc = '~foo~'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 6, type: 'del' }])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 6, type: 'syntax' },
    ])
})

test('codespan', () => {
    const doc = '`foo`'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 6, type: 'codespan' }])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 5, to: 6 },
    ])
})

test('link', () => {
    const doc = '[foo](https://example.com)'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 27,
            type: 'link',
            attrs: { href: 'https://example.com', title: null },
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
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 33,
            type: 'link',
            attrs: { href: 'https://example.com', title: 'bar' },
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 33, type: 'syntax' },
    ])
})

test('link without link', () => {
    const doc = '[foo]()'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 1, to: 8, type: 'link', attrs: { href: '', title: null } },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 5, type: 'preview' },
        { from: 5, to: 8, type: 'syntax' },
    ])
})

test('gfm url', () => {
    const doc = 'https://example.com'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 20,
            type: 'link',
            attrs: { href: 'https://example.com', title: undefined },
        },
    ])
    expect(decorations).toEqual([{ from: 1, to: 20, type: 'preview' }])
})

test('gfm email', () => {
    const doc = 'foo@example.com'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 16,
            type: 'link',
            attrs: {
                href: marks[0].attrs.href,
                title: undefined,
            },
        },
    ])
    expect(decorations).toEqual([{ from: 1, to: 16, type: 'preview' }])
})

test('autolink url', () => {
    const doc = '<https://example.com>'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 22,
            type: 'link',
            attrs: { href: 'https://example.com', title: undefined },
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
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 1,
            to: 18,
            type: 'link',
            attrs: { href: marks[0].attrs.href, title: undefined },
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 17, type: 'preview' },
        { from: 17, to: 18, type: 'syntax' },
    ])
})

test('strong with nested em', () => {
    const doc = '**foo *bar***'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 7, to: 12, type: 'em' },
        { from: 1, to: 14, type: 'strong' },
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
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 6, to: 13, type: 'strong' },
        { from: 1, to: 14, type: 'em' },
    ])
    expect(decorations).toEqual([
        { from: 6, to: 8 },
        { from: 11, to: 13 },
        { from: 1, to: 2 },
        { from: 13, to: 14 },
    ])
})

test('link with nested code', () => {
    const doc = '[`foo`](https://example.com)'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 2, to: 7, type: 'codespan' },
        {
            from: 1,
            to: 29,
            type: 'link',
            attrs: {
                href: 'https://example.com',
                title: null,
            },
        },
    ])
    expect(decorations).toEqual([
        { from: 2, to: 3 },
        { from: 6, to: 7 },
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 7, type: 'preview' },
        { from: 7, to: 29, type: 'syntax' },
    ])
})

test('wonky strong', () => {
    const doc = '**foo *bar**'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 13, type: 'strong' }])
    expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 11, to: 13 },
    ])
})

test('wonky gfm url', () => {
    const doc = '[foo](https://example.com'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 7,
            to: 26,
            type: 'link',
            attrs: { href: 'https://example.com', title: undefined },
        },
    ])
    expect(decorations).toEqual([{ from: 7, to: 26, type: 'preview' }])
})

test('gfm url with preceding characters', () => {
    const doc = 'foo https://example.com'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        {
            from: 5,
            to: 24,
            type: 'link',
            attrs: { href: 'https://example.com', title: undefined },
        },
    ])
    expect(decorations).toEqual([{ from: 5, to: 24, type: 'preview' }])
})

test('all inline marks', () => {
    const doc = '[`foo`](https://example.com) *bar* baz __merp moop__ ~meep~'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 2, to: 7, type: 'codespan' },
        {
            from: 1,
            to: 29,
            type: 'link',
            attrs: {
                href: 'https://example.com',
                title: null,
            },
        },
        { from: 30, to: 35, type: 'em' },
        { from: 40, to: 53, type: 'strong' },
        { from: 54, to: 60, type: 'del' },
    ])
    expect(decorations).toEqual([
        { from: 2, to: 3 },
        { from: 6, to: 7 },
        { from: 1, to: 2, type: 'syntax' },
        { from: 2, to: 7, type: 'preview' },
        { from: 7, to: 29, type: 'syntax' },
        { from: 30, to: 31 },
        { from: 34, to: 35 },
        { from: 40, to: 42 },
        { from: 51, to: 53 },
        { from: 54, to: 55, type: 'syntax' },
        { from: 55, to: 59, type: 'preview' },
        { from: 59, to: 60, type: 'syntax' },
    ])
})
