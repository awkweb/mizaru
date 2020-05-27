import { ListItem, NodeType } from '../types'

export function getInlineSyntaxLength(type: string) {
    switch (type) {
        case NodeType.Delete:
        case NodeType.Strong:
            return 2
        case NodeType.Emphasis:
        case NodeType.InlineCode:
            return 1
        default:
            return 0
    }
}

export function getListItemSyntaxLength(node: ListItem) {
    const { checked, num } = node
    let syntaxLength = 2
    if (typeof num === 'number') {
        syntaxLength = `${num}. `.length
    }
    if (checked !== null) {
        const boxLength = (checked ? `[x]` : `[ ]`).length + 1
        syntaxLength = syntaxLength + boxLength
    }
    return syntaxLength
}
