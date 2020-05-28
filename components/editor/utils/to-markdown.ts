/* eslint-disable */
import unified from 'unified'
import stringify from 'remark-stringify'
/* eslint-enable */
// @ts-ignore
import parse from 'rehype-parse'
// @ts-ignore
import rehype2remark from 'rehype-remark'

import { Fragment, Node as ProsemirrorNode } from 'prosemirror-model'

export function pmToMarkdown(
    doc: ProsemirrorNode | Fragment,
    emptyNewLine?: boolean,
) {
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

export function htmlToMarkdown(html: string) {
    try {
        const markdown = unified().use(parse).use(rehype2remark).use(stringify)
            .processSync
        const out = markdown(html)
        return <string>out.contents
    } catch (err) {
        return html
    }
}

export function stringToMarkdown(string: string) {
    return (string ?? '')
        .split('\n')
        .map((x) => `<p>${x}</p>`)
        .join('')
}
