import { Node as ProsemirrorNode } from 'prosemirror-model'
import { PluginKey, Plugin as ProsemirrorPlugin } from 'prosemirror-state'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { checkActive, toMarkdown } from '../../utils'
import Parser, { Decoration as Deco, Node } from '../../parser'
import Plugin from '../plugin'

const key = new PluginKey('markdown')

class Markdown extends Plugin {
    results: { decorations: Deco[]; nodes: Node[] } = {
        decorations: [],
        nodes: [],
    }

    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode) {
        const markdown = toMarkdown(doc, true)
        const out = Parser.parse(markdown)
        this.results = out
    }

    get decorations() {
        return this.results.decorations.map((deco) => {
            const attrs = { class: deco.type }
            return Decoration.inline(deco.from, deco.to, attrs)
        })
    }

    private createDeco(doc: ProsemirrorNode) {
        this.render(doc)
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
                        return this.createDeco(instance.doc)
                    },
                    apply: (tr, value, _oldState, _newState) => {
                        if (tr.docChanged) {
                            return this.createDeco(tr.doc)
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
