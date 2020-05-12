import { Schema } from 'prosemirror-model'

import { Markdown } from '../../plugins'
import { Doc, Heading, Paragraph, Text } from '../../nodes'
import { Codespan, Del, Em, Link, Strong } from '../../marks'
import { ExtensionManager } from '../../utils'

// @ts-ignore
const { out, type, mkState } = prosemirror

const extensionManager = new ExtensionManager([
    new Heading(),
    new Link(),
    new Del(),
    new Strong(),
    new Codespan(),
    new Em(),
    new Doc(),
    new Paragraph(),
    new Text(),
    new Markdown(),
])
const { nodes, marks, plugins } = extensionManager
const schema = new Schema({
    nodes,
    marks,
})
const { doc, p, em } = out(schema)
const active = out(schema, {
    mark: { active: true },
    node: { active: true },
})

test('text', () => {
    const md = 'foo'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(md)))
})

test('strong', () => {
    const md = '**foo**'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.strong(md))))
})

test('em', () => {
    const md = '*foo*'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.em(md))))
})

test('del', () => {
    const md = '~foo~'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.del(md))))
})

test('codespan', () => {
    const md = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.codespan(md))))
})

test('link', () => {
    const md = '[foo](https://example.com)'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.link(md))))
})

test('strong with nested em', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '**foo *bar***')
    expect(state.doc).toEqual(
        doc(p(active.strong('**foo ', em('*bar*'), '**'))),
    )
})

test('h1', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '# foo')
    expect(state.doc).toEqual(doc(active.h1('# foo')))
})

test('h2', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '## foo')
    expect(state.doc).toEqual(doc(active.h2('## foo')))
})

test('h3', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '### foo')
    expect(state.doc).toEqual(doc(active.h3('### foo')))
})

test('h4', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '#### foo')
    expect(state.doc).toEqual(doc(active.h4('#### foo')))
})

test('h5', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '##### foo')
    expect(state.doc).toEqual(doc(active.h5('##### foo')))
})

test('h6', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '###### foo')
    expect(state.doc).toEqual(doc(active.h6('###### foo')))
})
