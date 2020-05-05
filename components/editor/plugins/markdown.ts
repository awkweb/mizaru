import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

import { Plugin as PluginExtension } from '../utils'

const key = new PluginKey('markdown')

class Markdown extends PluginExtension {
    get name() {
        return 'markdown'
    }

    parse(doc: ProsemirrorNode) {
        console.log('=============================')
        console.log('PARSE')
        console.log('=============================')
        doc.descendants((node, pos) => {
            if (node.isText) {
            }
        })
    }

    plugins() {
        return [
            new Plugin({
                key,
                state: {
                    init: (_config, instance) => {
                        // this.parse(instance.doc)
                        return {}
                    },
                    apply: (tr, value, oldState, newState) => {
                        return value
                    },
                },
                appendTransaction: (transactions, oldState, newState) => {
                    console.log('=============appendTransaction=============')
                    const tr = newState.tr

                    transactions.forEach((transaction) => {
                        transaction.steps.forEach((step) => {
                            step.getMap().forEach(
                                (oldStart, oldEnd, newStart, newEnd) => {
                                    oldState.doc.nodesBetween(
                                        oldStart,
                                        oldEnd,
                                        (parentNode, parentPos) => {
                                            parentNode.text &&
                                                console.log(
                                                    'old',
                                                    parentNode.text,
                                                )
                                        },
                                    )
                                    newState.doc.nodesBetween(
                                        newStart,
                                        newEnd,
                                        (parentNode, parentPos) => {
                                            parentNode.text &&
                                                console.log(
                                                    'new',
                                                    parentNode.text,
                                                )
                                            parentNode.forEach(
                                                (childNode, childOffset) => {},
                                            )
                                        },
                                    )
                                },
                            )
                        })
                    })

                    return tr
                },
            }),
        ]
    }
}

export default Markdown
