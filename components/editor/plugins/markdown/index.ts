import { Node as ProsemirrorNode } from 'prosemirror-model'
import {
    PluginKey,
    Plugin as ProsemirrorPlugin,
    Selection,
} from 'prosemirror-state'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { checkActive } from '../../utils'
import Parser, { Decoration as Deco, Node } from '../../parser'
import Plugin from '../plugin'

const key = new PluginKey('markdown')

class Markdown extends Plugin {
    selection = { from: 0, to: 0 }
    results: { decorations: Deco[]; nodes: Node[] } = {
        decorations: [],
        nodes: [],
    }

    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode, selection: Selection) {
        this.selection = { from: 0, to: doc.nodeSize }
        const lines: string[] = []
        doc.descendants((node, pos) => {
            if (node.isBlock) {
                const from = pos
                const to = pos + 1 + node.textContent.length + 1
                if (from <= selection.from && to >= selection.to) {
                    this.selection = { from, to }
                }
                const line = node.textContent || '\n'
                lines.push(line)
            }
        })
        const content = Parser.toContent(lines)
        const out = Parser.parse(content)
        this.results = out
    }

    get decorations() {
        return this.results.decorations.map((deco) => {
            const attrs = { class: deco.type }
            return Decoration.inline(deco.from, deco.to, attrs)
        })
    }

    private createDeco(doc: ProsemirrorNode, selection: Selection) {
        this.render(doc, selection)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    get plugins() {
        return [
            new ProsemirrorPlugin({
                key,
                state: {
                    init: (_config, instance) => {
                        const { doc, selection } = instance
                        return this.createDeco(doc, selection)
                    },
                    apply: (tr, value, _oldState, _newState) => {
                        if (tr.docChanged) {
                            const { doc, selection } = tr
                            return this.createDeco(doc, selection)
                        }
                        return value
                    },
                },
                props: {
                    decorations(state) {
                        return (<ProsemirrorPlugin>this).getState(state)
                    },
                },
                appendTransaction: (_transactions, _oldState, newState) => {
                    const { doc, selection, schema, tr } = newState
                    const { nodes } = this.results
                    const docSize = doc.content.size

                    tr.removeMark(0, docSize)
                    nodes.forEach(({ type, ...rest }) => {
                        const { from, to, marks } = rest
                        const attrs = {
                            ...rest.attrs,
                            active: checkActive(from, to, selection),
                        }
                        const node = schema.node(type, attrs)
                        if (node.isTextblock) {
                            tr.setBlockType(from, to, node.type, attrs)
                        } else {
                            // const $from = doc.resolve(from)
                            // const $to = doc.resolve(to)
                            // const range = new NodeRange($from, $to, 0)
                            // tr.wrap(range, [{ type: node.type, attrs }])
                            // console.log('node', type, from, to)
                        }

                        marks?.forEach(({ type, ...rest }) => {
                            const { from, to } = rest
                            const attrs = {
                                ...rest.attrs,
                                active: checkActive(from, to, selection),
                            }
                            const mark = schema.mark(type, attrs)

                            tr.addMark(from, to, mark)
                            tr.removeStoredMark(mark)
                        })
                    })

                    return tr
                },
            }),
        ]
    }
}

export default Markdown
