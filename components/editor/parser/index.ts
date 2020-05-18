/* eslint-disable */
import remark, { PartialRemarkOptions } from 'remark'
import modifyChildren from 'unist-util-modify-children'
// @ts-ignore
import source from 'unist-util-source'
import { Parent, Node as UnistNode, Literal } from 'unist'
/* eslint-enable */

import { Decoration, Heading, Link, List, ListItem, Mark, Node } from './types'
import {
    getInlineSyntaxLength,
    getListItemSyntaxLength,
    modifyListItem,
} from './utils'

interface Props {
    offset: number
}

class Parser {
    doc = ''
    props: Props = {
        offset: 0,
    }

    constructor(props?: Partial<Props>) {
        this.props = { ...this.props, ...props }
    }

    static parse(doc: string, props?: Partial<Props>) {
        const parser = new Parser(props)
        return parser.parse(doc)
    }

    parse(doc: string) {
        this.doc = doc
        const settings = <PartialRemarkOptions>{
            commonmark: true,
            gfm: true,
            position: true,
        }
        const tree = remark().use({ settings }).parse(doc)
        const out = this.parseBlock((<Parent>tree).children, this.props.offset)
        return out
    }

    parseBlock(nodes_: UnistNode[], counter: number, boost?: number) {
        const decorations: Decoration[] = []
        const nodes: Node[] = []

        for (const node of nodes_) {
            const { type, children } = <Parent>node
            const from = counter

            switch (type) {
                case 'blockquote': {
                    const syntaxLength = 2
                    const out = this.parseBlock(children, counter, syntaxLength)
                    counter = out.counter + 1
                    const to = counter
                    const decorationStart = from + 1
                    decorations.push(...out.decorations, {
                        from: decorationStart,
                        to: decorationStart + syntaxLength,
                        type: 'syntax',
                    })
                    nodes.push(...out.nodes, {
                        from,
                        to,
                        type,
                        marks: [],
                    })
                    break
                }
                case 'heading': {
                    const out = this.renderHeading(
                        from,
                        children,
                        counter,
                        node,
                    )
                    counter = out.counter
                    decorations.push(...out.decorations)
                    nodes.push(...out.nodes)
                    break
                }
                case 'html': {
                    // console.log('node: ', node)
                    counter = counter + 2
                    break
                }
                case 'list': {
                    const modify = modifyChildren(modifyListItem)
                    modify(node)
                    const out = this.parseBlock(children, counter + 1)
                    counter = out.counter + 1
                    const to = counter
                    const { ordered, spread, start } = <List>node
                    nodes.push(...out.nodes, {
                        from,
                        to,
                        type,
                        marks: [],
                        attrs: { ordered, spread, start },
                    })
                    decorations.push(...out.decorations)
                    break
                }
                case 'listItem': {
                    const syntaxLength = getListItemSyntaxLength(<ListItem>node)
                    const out = this.parseBlock(
                        children,
                        counter + 1,
                        syntaxLength,
                    )
                    counter = out.counter + 1
                    const to = counter
                    const decorationStart = from + 2
                    decorations.push(...out.decorations, {
                        from: decorationStart,
                        to: decorationStart + syntaxLength,
                        type: 'syntax',
                    })
                    const { checked, spread } = <ListItem>node
                    nodes.push(...out.nodes, {
                        from,
                        to,
                        type,
                        marks: [],
                        attrs: {
                            checked,
                            spread,
                        },
                    })
                    break
                }
                case 'paragraph': {
                    const out = this.renderParagraph(
                        from,
                        children,
                        counter,
                        boost,
                    )
                    counter = out.counter
                    decorations.push(...out.decorations)
                    nodes.push(...out.nodes)
                    break
                }
                default: {
                    throw new Error(
                        `Block node with "${type}" type was not found.`,
                    )
                }
            }
        }
        return { counter, decorations, nodes }
    }

    private renderHeading(
        from: number,
        children: UnistNode[],
        counter: number,
        node: UnistNode,
    ) {
        const raw = this.getRawText(node)
        // Turn `#foo` and `  #foo` into paragraphs
        if (!raw.includes(' ') || raw.startsWith(' ')) {
            const value = raw.slice(0, raw.indexOf('#') + 1)
            const out = this.renderParagraph(
                from,
                [{ type: 'text', value }, ...children],
                counter,
            )
            return out
        }
        const { depth: level } = <Heading>node
        const syntaxLength = level + 1

        const value = raw.substring(syntaxLength, raw.length)
        // Leading spaces after syntax `#   foo`
        if (value.startsWith(' ')) {
            const firstNonWhitespaceChar = value.trim()[0]
            const leadingSpaces = value.slice(
                0,
                value.indexOf(firstNonWhitespaceChar),
            )
            children = [
                {
                    type: 'text',
                    value: ' '.repeat(leadingSpaces.length),
                },
                ...children,
            ]
        }
        // Trailing spaces after syntax `# foo   `
        if (value.endsWith('  ')) {
            const trimmedValue = value.trim()
            const trimmedValueLength = trimmedValue.length
            const lastNonWhitespaceChar = trimmedValue[trimmedValueLength - 1]
            const trailingSpaces = value.slice(
                value.lastIndexOf(lastNonWhitespaceChar) + 1,
                value.length,
            )
            children = [
                ...children,
                {
                    type: 'text',
                    value: ' '.repeat(trailingSpaces.length),
                },
            ]
        }
        const decorationStart = from + 1
        counter = decorationStart + syntaxLength
        const out = this.parseInline(children, counter)
        counter = out.counter + 1
        const to = counter
        return {
            counter,
            decorations: [
                ...out.decorations,
                {
                    from: decorationStart,
                    to: decorationStart + syntaxLength,
                    type: 'syntax',
                },
            ],
            nodes: [
                {
                    from,
                    to,
                    type: 'heading',
                    marks: out.marks,
                    attrs: { level },
                },
            ],
        }
    }

    private renderParagraph(
        from: number,
        children: UnistNode[],
        counter: number,
        boost?: number,
    ) {
        counter = counter + 1
        const out = this.parseInline(children, counter + (boost ?? 0))
        counter = out.counter + 1
        const to = counter
        return {
            counter,
            decorations: out.decorations,
            nodes: [{ from, to, type: 'paragraph', marks: out.marks }],
        }
    }

    parseInline(nodes: UnistNode[], counter: number) {
        const decorations: Decoration[] = []
        const marks: Mark[] = []

        for (const node of nodes) {
            const { type, children } = <Parent>node
            const syntaxLength = getInlineSyntaxLength(type)

            switch (type) {
                case 'inlineCode': {
                    const from = counter
                    const decorationStart = from
                    counter =
                        decorationStart +
                        syntaxLength +
                        ((<Literal>node).value as string).length +
                        syntaxLength
                    const decorationEnd = counter
                    const to = decorationEnd
                    decorations.push(
                        {
                            from: decorationStart,
                            to: decorationStart + syntaxLength,
                            type: 'syntax',
                        },
                        {
                            from: decorationEnd - syntaxLength,
                            to: decorationEnd,
                            type: 'syntax',
                        },
                    )
                    marks.push({ from, to, type })
                    break
                }
                case 'delete':
                case 'emphasis':
                case 'strong': {
                    const from = counter
                    counter = from + syntaxLength
                    const out = this.parseInline(children, counter)
                    counter = out.counter + syntaxLength
                    const to = counter
                    decorations.push(
                        ...out.decorations,
                        {
                            from,
                            to: from + syntaxLength,
                            type: 'syntax',
                        },
                        {
                            from: to - syntaxLength,
                            to,
                            type: 'syntax',
                        },
                    )
                    marks.push(...out.marks, { from, to, type })
                    break
                }
                case 'link': {
                    const { url, title } = <Link>node
                    const raw = this.getRawText(node)
                    break
                }
                case 'text': {
                    counter = counter + ((<Literal>node).value as string).length
                    break
                }
                default: {
                    throw new Error(
                        `Inline node with "${type}" type was not found.`,
                    )
                }
            }
        }
        return { decorations, counter, marks }
    }

    private getRawText(node: UnistNode) {
        return source(node, this.doc)
    }
}

export type { Decoration, Heading, Link, List, ListItem, Mark, Node }
export default Parser
