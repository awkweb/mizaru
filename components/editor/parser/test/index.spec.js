import { Lexer } from 'marked'

import Parser from '../'

test('strong', () => {
    const doc = '**foo**'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 7, type: 'strong' }])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 6, to: 7 },
    ])
})

test('em', () => {
    const doc = '*foo*'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 5, type: 'em' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 5 },
    ])
})

test('del', () => {
    const doc = '~foo~'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 5, type: 'del' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 5 },
    ])
})

test('codespan', () => {
    const doc = '`foo`'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 5, type: 'codespan' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 5 },
    ])
})

test('link', () => {
    const doc = '[foo](https://example.com)'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 26, type: 'link' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 26 },
    ])
})

test('link with title', () => {
    const doc = '[foo](https://example.com "bar")'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 31, type: 'link' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 31 },
    ])
})

test('link without link', () => {
    const doc = '[foo]()'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 7, type: 'link' }])
    expect(decorations).toEqual([
        { from: 1, to: 1 },
        { from: 5, to: 7 },
    ])
})

test('strong with nested em', () => {
    const doc = '**foo *bar***'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 7, to: 11, type: 'em' },
        { from: 1, to: 13, type: 'strong' },
    ])
    expect(decorations).toEqual([
        { from: 7, to: 7 },
        { from: 11, to: 11 },
        { from: 1, to: 2 },
        { from: 12, to: 13 },
    ])
})

test('link with nested code', () => {
    const doc = '[`foo`](https://example.com)'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 2, to: 6, type: 'codespan' },
        { from: 1, to: 28, type: 'link' },
    ])
    expect(decorations).toEqual([
        { from: 2, to: 2 },
        { from: 6, to: 6 },
        { from: 1, to: 1 },
        { from: 7, to: 28 },
    ])
})

test('wonky strong', () => {
    const doc = '**foo *bar**'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([{ from: 1, to: 12, type: 'strong' }])
    expect(decorations).toEqual([
        { from: 1, to: 2 },
        { from: 11, to: 12 },
    ])
})

test('all inline marks', () => {
    const doc = '[`foo`](https://example.com) *bar* baz __merp moop__'
    const lexer = new Lexer()
    const tokens = lexer.lex(doc)
    const parser = new Parser()
    const { marks, decorations } = parser.parse(tokens)
    expect(marks).toEqual([
        { from: 2, to: 6, type: 'codespan' },
        { from: 1, to: 28, type: 'link' },
        { from: 30, to: 34, type: 'em' },
        { from: 40, to: 52, type: 'strong' },
    ])
    expect(decorations).toEqual([
        { from: 2, to: 2 },
        { from: 6, to: 6 },
        { from: 1, to: 1 },
        { from: 7, to: 28 },
        { from: 30, to: 30 },
        { from: 34, to: 34 },
        { from: 40, to: 41 },
        { from: 51, to: 52 },
    ])
})
