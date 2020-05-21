/* eslint-disable */
import unified from 'unified'
import { PartialRemarkOptions } from 'remark'
import toMDAST from 'remark-parse'
import modifyChildren from 'unist-util-modify-children'
// @ts-ignore
import source from 'unist-util-source'
import { Node as UnistNode, Literal } from 'unist'
/* eslint-enable */

import {
    Decoration,
    Heading,
    Link,
    List,
    ListItem,
    Mark,
    Node,
    Parent,
} from './types'
import {
    getEnclosingWhitespace,
    getHeadingWhitespace,
    getInlineSyntaxLength,
    getListItemSyntaxLength,
    modifyListItem,
    toMDZAST,
} from './utils'

interface Props {
    offset: number
}

class Parser {
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
        const settings = <PartialRemarkOptions>{
            commonmark: true,
            gfm: true,
            position: true,
        }
        const tree = toMDZAST({ doc })(
            unified().use(toMDAST, settings).parse(doc),
        )
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
        const { depth: level, raw } = <Heading>node
        const syntaxChars = '#'.repeat(level)

        // If not fully formed, convert to paragraph
        if (raw === syntaxChars) {
            const child = { type: 'text', value: raw }
            children.push(child)
            return this.renderParagraph(from, children, counter)
        }

        const { leading, inner, trailing } = getHeadingWhitespace(raw, level)
        if (trailing) {
            const trimmed = raw.trim()
            const value =
                trimmed === syntaxChars || trailing.includes('#')
                    ? trailing.slice(0, trailing.length - 1)
                    : trailing
            const child = { type: 'text', value }
            children.push(child)
        }

        // If heading contains extra whitespace between syntax and text, add
        // whitespace length
        if (inner) {
            const child = { type: 'text', value: inner }
            children.unshift(child)
        }

        if (leading) {
            const child = { type: 'text', value: `${leading}${syntaxChars} ` }
            children.unshift(child)
            return this.renderParagraph(from, children, counter)
        }

        const syntaxLength = level + 1
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
                    break
                }
                case 'text': {
                    // console.log(`"${node.value}"`)
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
}

export type { Decoration, Heading, Link, List, ListItem, Mark, Node }
export default Parser
