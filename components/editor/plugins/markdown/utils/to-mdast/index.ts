/* eslint-disable */
import unified from 'unified'
import remarkParse, { Tokenizer } from 'remark-parse'
import visit from 'unist-util-visit'
import modifyChildren from 'unist-util-modify-children'
/* eslint-enable */
// @ts-ignore
import source from 'unist-util-source'
import disableTokenizers from 'remark-disable-tokenizers'

import { NodeType } from '../../types'
import { settings } from './constants'
import { remarkUnwrapNewLines } from './utils'
import { Node, Parent } from './types'
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

    // Disable tokenizers
    const disabled = {
        block: [NodeType.IndentedCode, NodeType.Definition, NodeType.Table],
        inline: [NodeType.Reference, NodeType.Break],
    }

    const tree = unified()
        .use(remarkParse, settings)
        .use(disableTokenizers, disabled)
        .parse(markdown)

    visit(tree, (node, _index, parent) => {
        // Get node raw value from markdown string
        node.raw = source(node, markdown)

        // Modify block and inline nodes
        const { inline, block } = modify
        const { type } = node
        if (inline.hasOwnProperty(type)) {
            modifyChildren(inline[type])(node)
        }

        if (block.hasOwnProperty(type)) {
            const index = block[type](<Node>node, <Parent>parent)
            if (index) return index
        }
    })

    remarkUnwrapNewLines(tree)

    return tree
}

export default toMDAST
