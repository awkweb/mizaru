// @ts-ignore
import findBefore from 'unist-util-find-before'

import { BlankLine, Node } from '../types'

function modifier(node: Node, tree: Node) {
    const { count } = <BlankLine>node
    const previousNode = findBefore(tree, node)
    const paragraphCount = previousNode ? count - 1 : count
    node.count = paragraphCount
}

export default modifier
