/* eslint-disable */
import unified from 'unified'
import remarkParse from 'remark-parse'
import visit from 'unist-util-visit'
import modifyChildren from 'unist-util-modify-children'
/* eslint-enable */
// @ts-ignore
import source from 'unist-util-source'

import { NodeType } from './types'
import { settings } from './constants'
import { escape } from './utils'
import tokenize from './tokenize'
import modify from './modify'

function toMDAST(markdown: string) {
    // @ts-ignore
    const blockTokenizers = remarkParse.Parser.prototype.blockTokenizers
    // Override tokenizers
    blockTokenizers.blankLine = tokenize.blankLine

    const content = escape(markdown)
    const tree = unified().use(remarkParse, settings).parse(content)

    visit(tree, (node) => {
        const { type } = node

        if (type !== NodeType.Root) {
            node.raw = source(node, content)
        }
        if (type === NodeType.InlineCode) {
            modify.inlineCode(node)
        }

        if (modify.hasOwnProperty(type)) {
            // @ts-ignore
            modifyChildren(modify[type])(node)
        }

        delete node.position
        delete node.raw
    })

    console.log(tree)
    tree.children[0].children.forEach((x) => console.log(x))

    return tree
}

export default toMDAST
