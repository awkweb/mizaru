import { Schema } from 'prosemirror-model'

import { Markdown } from '../../plugins'
import { Doc, Paragraph, Text } from '../../nodes'
import { Codespan, Del, Em, Link, Strong } from '../../marks'
import { ExtensionManager } from '../../utils'

const extensionManager = new ExtensionManager([
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
const { nodes, marks } = extensionManager
const schema = new Schema({
    nodes,
    marks,
})
const plugins = extensionManager.plugins({ schema })
const { doc, codespan, del, a, p, strong, em } = out(schema)

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
    expect(state.doc).toEqual(doc(p(strong(md))))
})

test('em', () => {
    const md = '*foo*'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(em(md))))
})

test('del', () => {
    const md = '~foo~'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(del(md))))
})

test('codespan', () => {
    const md = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(codespan(md))))
})

test('link', () => {
    const md = '[foo](https://example.com)'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(a(md))))
})

test('strong with nested em', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '**foo *bar***')
    expect(state.doc).toEqual(doc(p(strong('**foo ', em('*bar*'), '**'))))
})
