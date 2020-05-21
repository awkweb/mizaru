import { ListItem } from '../types'

export function getInlineSyntaxLength(type: string) {
    switch (type) {
        case 'delete':
        case 'strong':
            return 2
        case 'emphasis':
        case 'inlineCode':
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
