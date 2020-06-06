import { NodeType } from '../../../types'
import { Heading, Node, Parent } from '../types'
import { getHeadingWhitespace } from '../utils'

function modifier(node: Node, parent: Parent) {
    const { depth: level, raw } = <Heading>node
    const syntaxChars = '#'.repeat(level)

    // Convert to paragraph if only syntax
    if (raw === syntaxChars) {
        const child = { type: NodeType.Text, value: raw }
        const paragraph = { type: NodeType.Paragraph, children: [child] }
        const index = parent.children.indexOf(node)
        parent.children.splice(index, 1, paragraph)
    }

    const { leading, inner, trailing } = getHeadingWhitespace(raw, level)

    // Add trailing whitespace or closing sequence
    if (trailing) {
        const child = { type: NodeType.Syntax, value: trailing }
        ;(<Parent>node).children.push(child)
    }

    // Add inner spaces between opening sequence and text
    if (inner) {
        const child = { type: NodeType.Syntax, value: inner }
        ;(<Parent>node).children.unshift(child)
    }

    // Add opening sequence
    const child = { type: NodeType.Syntax, value: `${syntaxChars} ` }
    ;(<Parent>node).children.unshift(child)

    // Add leading whitespace
    if (leading) {
        const child = { type: NodeType.Syntax, value: leading }
        ;(<Parent>node).children.unshift(child)
    }
}

export default modifier
