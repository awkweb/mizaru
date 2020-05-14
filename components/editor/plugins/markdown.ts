import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey, Selection } from 'prosemirror-state'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { Plugin as PluginExtension } from '../utils'
import { Node, Decoration as ParserDecoration } from '../parser'
import { DecorationType } from '../types'

const key = new PluginKey('markdown')

class Markdown extends PluginExtension {
    results: { decorations: ParserDecoration[]; nodes: Node[] } = {
        decorations: [],
        nodes: [],
    }

    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode, selection: Selection) {
        const content = []
        doc.descendants((node, pos) => {
            if (node.isBlock) {
                console.log(`"${node.textContent}"`)
                content.push(node.textContent)
            }
        })
    }

    get decorations() {
        return this.results.decorations.map((deco) => {
            const attrs = {
                class: deco.type ?? DecorationType.Syntax,
            }
            return Decoration.inline(deco.from, deco.to, attrs)
        })
    }

    private createDeco(doc: ProsemirrorNode, selection: Selection) {
        this.results = { decorations: [], nodes: [] }
        this.render(doc, selection)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    get plugins() {
        return [
            new Plugin({
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
                        // @ts-ignore
                        return this.getState(state)
                    },
                },
                appendTransaction: (_transactions, _oldState, newState) => {
                    const tr = newState.tr
                    const { doc, selection, schema } = newState
                    // const { nodes } = this.results

                    return tr
                },
            }),
        ]
    }
}

export default Markdown
