import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'

import schema from '../../schema'

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
    const mark = schema.mark('bold')
    const text = childNode.text
    const hasMarks = childNode.marks.length > 0

    // Reset regex index
    const lastIndex = boldEm.lastIndex
    boldEm.lastIndex = 0

    if (hasMarks) {
        const markSyntaxValid = boldEm.exec(text)
        if (!markSyntaxValid) {
            const from = parentPos + childOffset
            const to = from + text.length + 1
            tr.removeMark(from, to, mark)
        } else if (markSyntaxValid?.[0] !== text) {
            // If mark is broken, fix them
            // For example, if `**hello world**` changes to `**hello** world**`
            console.log('Update marks')
        }
    } else {
        let m: any
        while ((m = boldEm.exec(text))) {
            const from = parentPos + childOffset + m.index + 1
            const to = from + m[0].length
            tr.addMark(from, to, mark)
        }
        // If text is equal to * or _ look to combine with preceding mark.
        // For example, `**hello***` with receive `*` and should output to
        // `<strong><span>**</span>hello*<span>**</span></strong>`
        if (text === '*' || text === '_') {
            console.log('Try to combine with preceding mark!')
        }
    }

    boldEm.lastIndex = lastIndex

    return tr
}

const markdownKey = new PluginKey('markdownKey')

function markdown(): Plugin {
    return new Plugin({
        key: markdownKey,
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

export default markdown
export { markdownKey }
