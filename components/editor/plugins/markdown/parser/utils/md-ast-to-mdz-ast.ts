/* eslint-disable */
import visit from 'unist-util-visit'
/* eslint-enable */
// @ts-ignore
import source from 'unist-util-source'
import { Literal, Node } from 'unist'

import unescape from './unescape'

const toMDZAST = (options: { content: string }) => (tree: Node): Node => {
    visit(tree, (node) => {
        if (node.type !== 'root') {
            node.raw = source(node, options.content)
        }
        if (node.type === 'inlineCode') {
            const value = <string>(<Literal>node).value
            // Remove escaped characters from inlineCode
            const unescaped = unescape(value)
            const hasClosingBackslash =
                unescaped.charAt(unescaped.length - 1) === '\\'
            // If inlineCode ends with a backslash attempting to escape
            // closing backtick, remove it from value
            // https://spec.commonmark.org/dingus/?text=`foobar\``
            node.value = hasClosingBackslash
                ? unescaped.slice(0, unescaped.length - 1)
                : unescaped
        }
    })
    return tree
}

export default toMDZAST
