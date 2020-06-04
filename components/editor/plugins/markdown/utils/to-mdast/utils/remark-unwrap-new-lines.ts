/* eslint-disable */
import visit from 'unist-util-visit'
/* eslint-enable */
import { Node, Parent } from 'unist'

import { NodeType } from '../../../types'

function getNewLineIndexes(node: Node) {
    const { children } = <Parent>node
    const length = children.length
    const newLineIndexes = []
    let index = -1
    let child

    while (++index < length) {
        child = children[index]

        if (child.type === NodeType.LineFeed) {
            newLineIndexes.push(index)
        }
    }

    return newLineIndexes
}

function onparagraph(node: Node, _index: number, parent: Node) {
    const newLineIndexes = getNewLineIndexes(node)
    if (newLineIndexes.length) {
        const nodes = []
        const children = (<Parent>node).children
        if (newLineIndexes[0] !== 0) {
            const splitNodes = {
                type: NodeType.Paragraph,
                children: children.slice(0, newLineIndexes[0]),
            }
            nodes.push(splitNodes)
        }

        for (const [counter, index] of newLineIndexes.entries()) {
            const nextIndex = newLineIndexes[counter + 1] ?? children.length
            const splitNodes = {
                type: NodeType.Paragraph,
                children: children.slice(index + 1, nextIndex),
            }
            nodes.push(splitNodes)
        }

        const index = (<Parent>parent).children.indexOf(node)
        ;(<Parent>parent).children.splice(index, 1, ...nodes)
    }
}

function unwrapNewLines(tree: Node) {
    visit(tree, NodeType.Paragraph, onparagraph)
}

export default unwrapNewLines
