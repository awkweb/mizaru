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
const { out, backspace, type, mkState } = prosemirror

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
const { doc, p, emphasis } = out(schema)
const active = out(schema, {
    mark: { active: true },
    node: { active: true },
})

test('text', () => {
    const content = 'foo'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(content)))
})

test('emphasis', () => {
    const content = '*foo*'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.emphasis(content))))
    state = backspace(state, 2)
    expect(state.doc).toEqual(doc(p(content.substring(0, content.length - 1))))
})

test('delete', () => {
    const content = '~~foo~~'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.delete(content))))
    state = backspace(state, 3)
    expect(state.doc).toEqual(doc(p(content.substring(0, content.length - 2))))
})

test('inlineCode', () => {
    const content = '`foo`'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.inlineCode(content))))
    state = backspace(state, 2)
    expect(state.doc).toEqual(doc(p(content.substring(0, content.length - 1))))
})

test('strong', () => {
    const content = '**foo**'
    let state = mkState({ schema, plugins })
    state = type(state, content)
    expect(state.doc).toEqual(doc(p(active.strong(content))))
    state = backspace(state, 3)
    expect(state.doc).toEqual(doc(p(content.substring(0, content.length - 2))))
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

test('strong with nested em', () => {
    let state = mkState({ schema, plugins })
    state = type(state, '**foo *bar***')
    expect(state.doc).toEqual(
        doc(p(active.strong('**foo ', emphasis('*bar*'), '**'))),
    )
})
