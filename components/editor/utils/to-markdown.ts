import { Node as ProsemirrorNode } from 'prosemirror-model'

function toMarkdown(doc: ProsemirrorNode, emptyNewLine?: boolean) {
    const lines: string[] = []
    doc.descendants((node, _pos) => {
        if (node.isBlock) {
            let line = node.textContent
            if (emptyNewLine && !line.trim()) {
                line = `${line}\n`
            }
            lines.push(line)
        }
    })
    return lines.join('\n')
}

export default toMarkdown
