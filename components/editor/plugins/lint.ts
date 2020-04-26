import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'

import schema from '../schema'

// From https://github.com/erikvullings/slimdown-js
const boldEm = /(\*\*|__)(.*?)\1/g

function lintDoc(doc) {
    let result = []

    function record(from, to) {
        result.push({ from, to })
    }

    doc.descendants((node, pos) => {
        if (node.isText) {
            let m
            while ((m = boldEm.exec(node.text))) {
                const from = pos + m.index
                const to = pos + m.index + m[0].length
                record(from, to)
            }
        }
    })

    return result
}

function lintDeco(doc) {
    let decos = []
    lintDoc(doc).forEach((prob) => {
        decos.push(
            Decoration.inline(prob.from, prob.from + 2, {
                class: 'text-border',
            }),
            Decoration.inline(prob.to - 2, prob.to, {
                class: 'text-border',
            }),
        )
    })
    return DecorationSet.create(doc, decos)
}

function maybeAddRemoveMarks(childNode, childOffset, parentPos, tr) {
    const mark = schema.mark('strong')
    const text = childNode.text
    const hasMarks = childNode.marks.length > 0

    console.log('====================')
    console.log(typeof text, text)
    console.log(childNode)
    if (hasMarks) {
        console.log('hasMarks')
        const markSyntaxValid = boldEm.test(text)
        if (!markSyntaxValid) {
            console.log('Remove')
            const from = parentPos + childOffset
            const to = from + text.length + 1
            tr.removeMark(from, to, mark)
        }
    } else {
        let m: any
        while ((m = boldEm.exec(text))) {
            console.log('Add')
            const from = parentPos + childOffset + m.index + 1
            const to = from + m[0].length
            tr.addMark(from, to, mark)
        }
    }

    return tr
}

const lintKey = new PluginKey('lint')

function lint(): Plugin {
    return new Plugin({
        key: lintKey,
        state: {
            init(_, { apply, tr, doc }) {
                // console.log('init', doc)
                const decorations = lintDeco(doc)
                return { decorations }
            },
            apply(transaction, state) {
                // console.log('apply', transaction.doc)
                if (transaction.docChanged) {
                    const decorations = lintDeco(transaction.doc)
                    return { decorations }
                } else {
                    return state
                }
            },
        },
        props: {
            decorations(state) {
                return this.getState(state).decorations
            },
        },
        appendTransaction(transactions, oldState, newState) {
            let tr = newState.tr
            transactions.forEach((transaction) => {
                transaction.steps.forEach((step) => {
                    step.getMap().forEach(
                        (oldStart, oldEnd, newStart, newEnd) => {
                            newState.doc.nodesBetween(
                                newStart,
                                newEnd,
                                (parentNode, parentPos) => {
                                    parentNode.forEach(
                                        (childNode, childOffset) => {
                                            maybeAddRemoveMarks(
                                                childNode,
                                                childOffset,
                                                parentPos,
                                                tr,
                                            )
                                        },
                                    )
                                },
                            )
                        },
                    )
                })
            })

            return tr
        },
    })
}

export default lint
