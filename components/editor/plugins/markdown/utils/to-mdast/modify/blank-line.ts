// @ts-ignore
import findBefore from 'unist-util-find-before'

import { BlankLine, Node, Parent } from '../types'

function modifier(node: Node, tree: Parent) {
    const { count } = <BlankLine>node
    const previousNode = findBefore(tree, node)
    // If there is a previous node, then remove one from the count since an
    // extra newLine character is added after a line
    const paragraphCount = previousNode ? count - 1 : count
    const index = tree.children.indexOf(node)

    // Swap the node with new paragraphs
    const emptyParagraph = {
        type: 'paragraph',
        children: [],
    }
    const nodes = Array(paragraphCount).fill(emptyParagraph)
    tree.children.splice(index, 1, ...nodes)
}

export default modifier
