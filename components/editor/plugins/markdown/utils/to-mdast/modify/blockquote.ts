import { Node as UnistNode, Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'
import { Node, Parent } from '../types'
import { getBlockquoteWhitespace } from '../utils'

const syntaxChars = '>'

function block(node: Node, parent: Parent) {
    const { raw } = node

    // Convert to paragraph if only syntax
    if (raw === syntaxChars) {
        console.log('convert to paragraph')
        const child = { type: NodeType.Text, value: raw }
        const paragraph = { type: NodeType.Paragraph, children: [child] }
        const index = parent.children.indexOf(node)
        parent.children.splice(index, 1, paragraph)
        return
    }

    // Add paragraph to empty blockquote
    const { leading, inner } = getBlockquoteWhitespace(raw)
    if (raw === `${leading ?? ''}${syntaxChars}${inner ?? ''}`) {
        console.log('fill empty')
        const child = { type: NodeType.Text, value: raw }
        const paragraph = { type: NodeType.Paragraph, children: [child] }
        ;(<Parent>node).children.push(paragraph)
    }
}

function inline(node: UnistNode, _index: number, parent: UnistParent) {
    const { raw } = <Parent>parent
    if (raw === syntaxChars) return

    console.log(node)
    if (node.type === NodeType.Syntax) {
        console.log('nested')
        console.log(parent.children)
        return
    }

    const { leading, inner } = getBlockquoteWhitespace(raw)
    console.log('inner', `"${inner}"`)

    // Add opening sequence
    const child = {
        type: NodeType.Syntax,
        value: `${syntaxChars}${inner ?? ''}`,
    }
    ;(<Parent>node).children.unshift(child)

    // Add leading whitespace
    if (leading) {
        console.log('leading')
        const child = { type: NodeType.Syntax, value: leading }
        ;(<Parent>node).children.unshift(child)
    }
}

export default { block, inline }
