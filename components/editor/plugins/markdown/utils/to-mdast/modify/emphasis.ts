import { Node as UnistNode, Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'
import { Parent } from '../types'

function modifier(node: UnistNode, index: number, parent: UnistParent) {
    const isSyntax = node.type === NodeType.Syntax
    if (isSyntax) return

    const { children, raw } = <Parent>parent
    const isFirst = index === 0
    const isLast = index === children.length - 1

    const syntaxChar = raw.startsWith('*') ? '*' : '_'
    const syntaxChild = {
        type: NodeType.Syntax,
        value: syntaxChar,
    }

    if (isFirst) parent.children.unshift(syntaxChild)
    if (isLast) parent.children.push(syntaxChild)
}

export default modifier
