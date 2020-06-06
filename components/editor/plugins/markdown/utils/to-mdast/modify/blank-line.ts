// @ts-ignore
import findBefore from 'unist-util-find-before'

import { NodeType } from '../../../types'
import { BlankLine, Node, Parent } from '../types'

function modifier(node: Node, parent: Parent) {
    const { count } = <BlankLine>node
    const previousNode = findBefore(parent, node)
    const isParentRoot = parent.type === NodeType.Root

    // If there is a previous node and parent is root node, then remove one
    // from the count since an extra newLine character is added after a line
    const paragraphCount = previousNode && isParentRoot ? count - 1 : count

    // Swap the node with new paragraphs
    const index = parent.children.indexOf(node)
    const emptyParagraph = {
        type: NodeType.Paragraph,
        children: [],
    }
    const nodes = Array(paragraphCount).fill(emptyParagraph)
    parent.children.splice(index, 1, ...nodes)

    // If no paragraphs were added, iterate over the previous index again
    if (paragraphCount === 0) return index
}

export default modifier
