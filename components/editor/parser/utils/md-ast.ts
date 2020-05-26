/* eslint-disable */
import unified from 'unified'
import remarkParse from 'remark-parse'
import visit from 'unist-util-visit'
/* eslint-enable */
import { Literal, Node, Parent } from 'unist'
// @ts-ignore
import source from 'unist-util-source'
// @ts-ignore
import disableTokenizers from 'remark-disable-tokenizers'

import { settings } from '../constants'
import { blankLine } from './tokenize'
import unescape from './unescape'
import escape from './escape'

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

function getMDAST(content: string) {
    // Escape backslashes and other characters so markdown processor
    // doesn't strip them
    content = content.replace(/(\\)/g, '\\\\')
    content = escape(content)

    // @ts-ignore
    const blockTokenizers = remarkParse.Parser.prototype.blockTokenizers

    // Override tokenizers
    blockTokenizers.blankLine = blankLine

    // Disable tokenizers
    const disabled = {
        block: [
            'indentedCode',
            // 'fencedCode',
            // 'blockquote',
            // 'thematicBreak',
            // 'list',
            // 'html',
            'definition',
            'table',
        ],
        inline: [
            'autoLink',
            'url',
            'email',
            'html',
            'link',
            'reference',
            'break',
        ],
    }

    const markdown = unified()
        .use(remarkParse, settings)
        .use(disableTokenizers, disabled)
        .parse(content)
    const tree = <Parent>toMDZAST({ content })(markdown)
    return tree
}

export default getMDAST
