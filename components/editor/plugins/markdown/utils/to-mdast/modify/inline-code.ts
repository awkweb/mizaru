// @ts-ignore
import { Literal, Node, Parent } from 'unist'

import { backslash } from '../constants'
import { unescape } from '../utils'

function modifier(node: Node) {
    const value = <string>(<Literal>node).value

    // Remove escaped characters from inlineCode
    const unescaped = unescape(value)
    const hasClosingBackslash =
        unescaped.charAt(unescaped.length - 1) === backslash

    // If inlineCode ends with a backslash attempting to escape
    // closing backtick, remove it from value
    // https://spec.commonmark.org/dingus/?text=`foobar\``
    node.value = hasClosingBackslash
        ? unescaped.slice(0, unescaped.length - 1)
        : unescaped
}

export default modifier
