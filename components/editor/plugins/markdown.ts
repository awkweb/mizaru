import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

import { Lexer } from 'marked'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { Plugin as PluginExtension } from '../utils'
import Parser, { Decorations, Marks } from '../parser'

const key = new PluginKey('markdown')

class Markdown extends PluginExtension {
    results: { decorations: Decorations; marks: Marks } = {
        decorations: [],
        marks: [],
    }

    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode) {
        doc.descendants((node, pos) => {
            // TODO use `pos`
            if (node.isText && node.text) {
                const lexer = new Lexer()
                const tokens = lexer.lex(node.text)
                const parser = new Parser({ offset: pos })
                // @ts-ignore
                const elements = parser.parse(tokens)
                const { marks, decorations } = elements
                this.results = {
                    decorations: [...this.results.decorations, ...decorations],
                    marks: [...this.results.marks, ...marks],
                }
            }
        })
    }

    get decorations() {
        return this.results.decorations.map((deco) =>
            Decoration.inline(deco.from, deco.to, {
                class: 'syntax',
            }),
        )
    }

    private createDeco(doc: ProsemirrorNode) {
        this.results = { decorations: [], marks: [] }
        this.render(doc)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    plugins() {
        return [
            new Plugin({
                key,
                state: {
                    init: (_config, instance) => {
                        return this.createDeco(instance.doc)
                    },
                    apply: (tr, value, oldState, newState) => {
                        if (tr.docChanged) {
                            return this.createDeco(tr.doc)
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
                appendTransaction: (transactions, oldState, newState) => {
                    console.log('=============appendTransaction=============')
                    const tr = newState.tr
                    const schema = newState.schema
                    this.results.marks.forEach(({ attrs, from, to, type }) => {
                        const mark = schema.mark(type, attrs)
                        tr.addMark(from, to, mark)
                        tr.removeStoredMark(mark)
                    })

                    // transactions.forEach((transaction) => {
                    //     transaction.steps.forEach((step) => {
                    //         step.getMap().forEach(
                    //             (oldStart, oldEnd, newStart, newEnd) => {
                    //                 oldState.doc.nodesBetween(
                    //                     oldStart,
                    //                     oldEnd,
                    //                     (parentNode, parentPos) => {
                    //                         parentNode.text &&
                    //                             console.log(
                    //                                 'old',
                    //                                 parentNode.text,
                    //                             )
                    //                     },
                    //                 )
                    //                 newState.doc.nodesBetween(
                    //                     newStart,
                    //                     newEnd,
                    //                     (parentNode, parentPos) => {
                    //                         parentNode.text &&
                    //                             console.log(
                    //                                 'new',
                    //                                 parentNode.text,
                    //                             )
                    //                         parentNode.forEach(
                    //                             (childNode, childOffset) => {},
                    //                         )
                    //                     },
                    //                 )
                    //             },
                    //         )
                    //     })
                    // })

                    return tr
                },
            }),
        ]
    }
}

export default Markdown
