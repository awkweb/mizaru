/* eslint-disable */
import unified from 'unified'
import remarkParse, { Tokenizer } from 'remark-parse'
import visit from 'unist-util-visit'
import modifyChildren from 'unist-util-modify-children'
/* eslint-enable */
// @ts-ignore
import source from 'unist-util-source'

import { NodeType } from '../../types'
import { settings } from './constants'
import { remarkUnwrapNewLines } from './utils'
import { Parent } from './types'
import tokenize from './tokenize'
import modify from './modify'

function toMDAST(markdown: string) {
    // @ts-ignore
    const blockTokenizers = remarkParse.Parser.prototype.blockTokenizers
    const inlineTokenizers = remarkParse.Parser.prototype.inlineTokenizers
    const inlineMethods = remarkParse.Parser.prototype.inlineMethods

    // Override tokenizers
    blockTokenizers.blankLine = tokenize.blankLine
    inlineTokenizers.lineFeed = <Tokenizer>tokenize.lineFeed
    inlineMethods.splice(
        inlineMethods.indexOf(NodeType.Text),
        0,
        NodeType.LineFeed,
    )

    const tree = unified().use(remarkParse, settings).parse(markdown)

    visit(tree, (node, _index, parent) => {
        // Get node raw value from markdown string
        node.raw = source(node, markdown)

        // Modify block and inline nodes
        const { inline, block } = modify
        const { type } = node
        if (inline.hasOwnProperty(type)) {
            modifyChildren(inline[type])(node)
        } else if (block.hasOwnProperty(type)) {
            block[type](node, <Parent>parent)
        }

        // Discard position and raw from node after use
        delete node.position
        delete node.raw
    })

    remarkUnwrapNewLines(tree)

    // console.log(tree)
    // @ts-ignore
    // tree.children.forEach((z) => {
    //     const children = z.children
    //     if (children) {
    //         children.forEach((x: any) => console.log(x))
    //     } else {
    //         console.log(z)
    //     }
    // })

    return tree
}

export default toMDAST
