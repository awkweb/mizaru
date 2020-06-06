import { NodeType } from '../../../types'
import { Node, Parent } from '../types'
import { getBlockquoteWhitespace } from '../utils'

function modifier(node: Node, parent: Parent) {
    const { raw } = node
    const syntaxChars = '>'

    // Convert to paragraph if only syntax
    if (raw === syntaxChars) {
        const child = { type: NodeType.Text, value: raw }
        const paragraph = { type: NodeType.Paragraph, children: [child] }
        const index = parent.children.indexOf(node)
        parent.children.splice(index, 1, paragraph)
        return
    }

    const { leading, inner } = getBlockquoteWhitespace(raw)

    // Add opening sequence
    const child = {
        type: NodeType.Syntax,
        value: `${syntaxChars}${inner ?? ''}`,
    }
    console.log(node.children)
    ;(<Parent>node).children.unshift(child)

    // Add leading whitespace
    if (leading) {
        const child = { type: NodeType.Syntax, value: leading }
        ;(<Parent>node).children.unshift(child)
    }
}

export default modifier
