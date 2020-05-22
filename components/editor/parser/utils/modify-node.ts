import { Node, Parent } from 'unist'

import { List } from '..'

export function modifyListItem(node: Node, index: number, parent: Parent) {
    const { start } = <List>parent
    const num = typeof start === 'number' ? start + index : null
    parent.children.splice(index, 1, { ...node, num })
}
