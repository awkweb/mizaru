import Markdown from '..'

// @ts-ignore
const { carriageReturn, out, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Markdown()])
const { doc, p } = out(schema)

test('single word', () => {
    const content = 'foo'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('multiple words', () => {
    const content = 'foo bar baz'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('backslash', () => {
    const content = '\\'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('backslash between multiple words', () => {
    const content = 'foo\\ bar baz'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('split across multiple lines', () => {
    const content = 'foo bar baz'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
    state = carriageReturn(state, 5)
    expect(state.doc).toEqual(doc(p('foo '), p('bar baz')))
    state = carriageReturn(state, 11)
    expect(state.doc).toEqual(doc(p('foo '), p('bar '), p('baz')))
})
