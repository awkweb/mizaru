import { Node as UnistNode, Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'
import { Parent } from '../types'

function modifier(node: UnistNode, index: number, parent: UnistParent) {
    const isSyntax = node.type === NodeType.Syntax
    if (isSyntax) return

    const { children, raw } = <Parent>parent
    const isFirst = index === 0
    const isLast = index === children.length - 1

    const syntaxChar = raw.startsWith('**') ? '**' : '__'
    const child = { type: NodeType.Syntax, value: syntaxChar }

    if (isFirst) parent.children.unshift(child)
    if (isLast) parent.children.push(child)
}

export default modifier
