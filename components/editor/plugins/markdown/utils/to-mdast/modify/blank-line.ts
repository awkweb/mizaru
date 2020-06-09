// @ts-ignore
import findBefore from 'unist-util-find-before'

import { NodeType } from '../../../types'
import { BlankLine, Node, Parent } from '../types'
import { lineFeed } from '../constants'

function modifier(node: Node, parent: Parent) {
    const previousNode = findBefore(parent, node)
    const isParentRoot = parent.type === NodeType.Root
    let { count, values } = <BlankLine>node

    // If there is a previous node and parent is root node, then remove one
    // from the count since an extra newLine character is added after a line
    const postBlockLineFeed = previousNode && isParentRoot
    const paragraphCount = postBlockLineFeed ? count - 1 : count
    const paragraphValues = values.slice(
        postBlockLineFeed ? 1 : 0,
        values.length,
    )

    // Generate paragraphs to replace blankLine nodes
    let nodes = []
    for (const val of paragraphValues) {
        const value = val.replace(lineFeed, '')
        const children = value ? [{ type: NodeType.Text, value }] : []
        const child = { type: NodeType.Paragraph, children }
        nodes.push(child)
    }

    // Swap the node with new paragraphs
    const index = parent.children.indexOf(node)
    parent.children.splice(index, 1, ...nodes)

    // If no paragraphs were added, iterate over the previous index again
    if (paragraphCount === 0) return index
}

export default modifier
