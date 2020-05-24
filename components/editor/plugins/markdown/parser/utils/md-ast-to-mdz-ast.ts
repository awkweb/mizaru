/* eslint-disable */
import visit from 'unist-util-visit'
/* eslint-enable */
// @ts-ignore
import source from 'unist-util-source'
import { Node } from 'unist'

const toMDZAST = (options: { doc: string }) => (tree: Node): Node => {
    visit(tree, (node) => {
        if (node.type !== 'root') {
            node.raw = source(node, options.doc)
        }
    })
    return tree
}

export default toMDZAST
