import { Node as ProsemirrorNode } from 'prosemirror-model'

const blockSeparator = '\n'
const leafText = '\n'

function toMarkdown(doc: ProsemirrorNode) {
    const from = 0
    const to = doc.content.size

    let content = ''
    let separated = true
    doc.nodesBetween(from, to, (node, pos) => {
        const isEmpty = node.content.size === 0
        if (node.isText) {
            content +=
                node?.text?.slice(Math.max(from, pos) - pos, to - pos) ?? ''
            separated = !blockSeparator
        } else if (node.isLeaf && leafText) {
            content += leafText
            separated = !blockSeparator
        } else if (!separated && node.isBlock) {
            content += `${isEmpty ? blockSeparator : ''}${blockSeparator}`
            separated = true
        } else if (node.content.size === 0) {
            content += '\n'
        }
    })

    return content
}

export default toMarkdown
