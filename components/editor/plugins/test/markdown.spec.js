import { Schema } from 'prosemirror-model'

import { Markdown } from '../../plugins'
import { Doc, Paragraph, Text } from '../../nodes'
import { Codespan, Del, Em, Link, Strong } from '../../marks'
import { ExtensionManager } from '../../utils'

const { out, type, mkState } = prosemirror

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
const { doc, p, em } = out(schema)
const {
    codespan: codespanActive,
    del: delActive,
    link: linkActive,
    strong: strongActive,
    em: emActive,
} = out(schema, {
    markAttrs: { active: true },
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
    expect(state.doc).toEqual(doc(p(strongActive(md))))
})

test('em', () => {
    const md = '*foo*'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(emActive(md))))
})

test('del', () => {
    const md = '~foo~'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(delActive(md))))
})

test('codespan', () => {
    const md = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(codespanActive(md))))
})

test('link', () => {
    const md = '[foo](https://example.com)'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(linkActive(md))))
})

test('strong with nested em', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '**foo *bar***')
    expect(state.doc).toEqual(doc(p(strongActive('**foo ', em('*bar*'), '**'))))
})
