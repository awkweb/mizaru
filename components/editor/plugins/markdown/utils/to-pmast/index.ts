import { Node, Parent } from 'unist'
// @ts-ignore
import flatMap from 'unist-util-flatmap'

import { NodeType } from '../../types'

const marks = {
    [NodeType.Emphasis]: true,
    [NodeType.Strong]: true,
}

function inline(node: Node, parent: Node) {
    const { type, value: text, ...rest } = node
    const marks = [...(<string[]>rest.marks ?? []), { type: parent.type }]
    return {
        ...rest,
        ...(text ? { text } : {}),
        // Temporarily convert `syntax` to `text`
        // Will add decorations later
        ...{ type: type === NodeType.Syntax ? 'text' : type },
        marks,
    }
}

function flatten(ast: Node) {
    return flatMap(ast, (node: Node) => {
        // Flatten marks to ProseMirror structure
        if (marks.hasOwnProperty(node.type)) {
            return (<Parent>node).children.map((child: Node) => {
                return inline(child, node)
            })
        }

        // Rename `children` to `content`
        if (node.children) {
            const { children: content, ...rest } = node
            return [
                {
                    ...rest,
                    content,
                },
            ]
        }

        // Rename `value` to `text`
        if (node.value) {
            const { value, ...rest } = node
            return [
                {
                    ...rest,
                    text: value,
                },
            ]
        }

        return [node]
    })
}

function toPMAST(mdast: Node) {
    const tree = flatten(mdast)
    // Rename `root` to `doc`
    tree.type = 'doc'
    return tree
}

export default toPMAST
