import { Schema } from 'prosemirror-model'

import { Markdown } from '../../plugins'
import {
    Doc,
    Heading,
    ListItem,
    OrderedList,
    Paragraph,
    Text,
    UnorderedList,
} from '../../nodes'
import { Delete, Emphasis, InlineCode, Link, Strong } from '../../marks'
import { ExtensionManager } from '../../utils'

// @ts-ignore
const { out, type, mkState } = prosemirror

const extensionManager = new ExtensionManager([
    new Delete(),
    new Doc(),
    new Emphasis(),
    new Heading(),
    new InlineCode(),
    new Link(),
    new ListItem(),
    new Markdown(),
    new OrderedList(),
    new Paragraph(),
    new Strong(),
    new Text(),
    new UnorderedList(),
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

test('emphasis', () => {
    const md = '*foo*'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.emphasis(md))))
})

test('delete', () => {
    const md = '~foo~'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.delete(md))))
})

test('inlineCode', () => {
    const md = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, md)
    expect(state.doc).toEqual(doc(p(active.inlineCode(md))))
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

const headings = [
    { tag: 'h1', syntax: '# ' },
    { tag: 'h2', syntax: '## ' },
    { tag: 'h3', syntax: '### ' },
    { tag: 'h4', syntax: '#### ' },
    { tag: 'h5', syntax: '##### ' },
    { tag: 'h6', syntax: '###### ' },
]
for (let { tag, syntax } of headings) {
    test(tag, () => {
        const content = `${syntax} foo`
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(active[tag](content)))
    })
}
