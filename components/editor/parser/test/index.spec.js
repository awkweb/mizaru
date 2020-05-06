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
        { from: 1, to: 2 },
        { from: 5, to: 6 },
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
        { from: 1, to: 2 },
        { from: 5, to: 27 },
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
            to: 32,
            type: 'link',
            attrs: { href: 'https://example.com', title: 'bar' },
        },
    ])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 5, to: 32 },
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
        { from: 1, to: 2 },
        { from: 5, to: 8 },
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
        { from: 1, to: 2 },
        { from: 7, to: 29 },
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

test('all inline marks', () => {
    const doc = '[`foo`](https://example.com) *bar* baz __merp moop__'
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
    ])
    expect(decorations).toEqual([
        { from: 2, to: 3 },
        { from: 6, to: 7 },
        { from: 1, to: 2 },
        { from: 7, to: 29 },
        { from: 30, to: 31 },
        { from: 34, to: 35 },
        { from: 40, to: 42 },
        { from: 51, to: 53 },
    ])
})
