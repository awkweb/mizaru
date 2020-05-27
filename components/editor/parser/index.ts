/* eslint-disable */
import { Node as UnistNode, Literal } from 'unist'
/* eslint-enable */

import {
    BlankLine,
    Decoration,
    Heading,
    Mark,
    Node,
    NodeType,
    Parent,
} from './types'
import {
    getBlockquoteWhitespace,
    getHeadingWhitespace,
    getInlineSyntaxLength,
    getMDAST,
    getNewLines,
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

    static parse(content: string, props?: Partial<Props>) {
        const parser = new Parser(props)
        return parser.parse(content)
    }

    parse(content: string) {
        const tree = getMDAST(content)
        const out = this.parseBlock(tree.children, this.props.offset)
        return out
    }

    parseBlock(tree: UnistNode[], counter: number, boost?: number) {
        const decorations: Decoration[] = []
        const nodes: Node[] = []

        for (const node of tree) {
            const { type, children } = <Parent>node
            const from = counter

            switch (type) {
                case NodeType.Blockquote: {
                    const out = this.renderBlockquote(
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
                case NodeType.BlankLine: {
                    const { count, raw } = <BlankLine>node
                    const newLines = getNewLines(raw)
                    const isAfter = newLines.length % 2 !== 0
                    counter = counter + count - (isAfter ? 1 : 0)
                    break
                }
                case NodeType.Heading: {
                    const out = this.renderHeading(
                        from,
                        children,
                        counter,
                        node,
                        boost,
                    )
                    counter = out.counter
                    decorations.push(...out.decorations)
                    nodes.push(...out.nodes)
                    break
                }
                case NodeType.Paragraph: {
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

    private renderBlockquote(
        from: number,
        children: UnistNode[],
        counter: number,
        node: UnistNode,
    ) {
        const { raw } = <Parent>node
        // If not fully formed, convert to paragraph
        if (raw === '>') {
            const child = { type: 'text', value: raw }
            children.push(child)
            return this.renderParagraph(from, children, counter)
        }

        const { leading, inner } = getBlockquoteWhitespace(raw)
        const syntaxLength =
            (leading?.length ?? 0) + (inner?.length > 0 ? 1 : 0) + 1
        counter = from + 1
        const out = this.parseBlock(children, counter, syntaxLength)
        counter = out.counter + 1
        const to = counter
        const decorationStart = from + 2
        const decorationEnd = decorationStart + syntaxLength
        return {
            counter,
            decorations: [
                ...out.decorations,
                {
                    from: decorationStart,
                    to: decorationEnd,
                    type: 'syntax',
                },
            ],
            nodes: [
                ...out.nodes,
                {
                    from,
                    to,
                    type: NodeType.Blockquote,
                },
            ],
        }
    }

    private renderHeading(
        from: number,
        children: UnistNode[],
        counter: number,
        node: UnistNode,
        boost?: number,
    ) {
        const { depth: level, raw } = <Heading>node
        const syntaxChars = '#'.repeat(level)

        // If not fully formed, convert to paragraph
        if (raw === syntaxChars) {
            const child = { type: NodeType.Text, value: raw }
            children.push(child)
            return this.renderParagraph(from, children, counter)
        }

        const { leading, inner, trailing } = getHeadingWhitespace(raw, level)
        let decorationClosing
        if (trailing) {
            const trimmed = raw.trim()
            const value =
                trimmed === syntaxChars
                    ? trailing.slice(0, trailing.length - 1)
                    : trailing
            const child = { type: NodeType.Text, value }
            children.push(child)

            const hasClosingSequence = trailing.includes('#')
            if (hasClosingSequence) {
                const decorationTo = from + raw.length + 1
                decorationClosing = {
                    from: decorationTo - value.length,
                    to: decorationTo,
                    type: 'syntax',
                }
            }
        }

        // If heading contains extra whitespace between syntax and text, add
        // whitespace length
        if (inner) {
            const child = { type: NodeType.Text, value: inner }
            children.unshift(child)
        }

        const syntaxLength = (leading?.length ?? 0) + level + 1
        const decorationStart = (boost ?? 0) + from + 1
        counter = decorationStart + syntaxLength
        const out = this.parseInline(children, counter)
        counter = out.counter + 1
        const to = counter
        const decorationEnd =
            decorationStart + syntaxLength + (inner?.length ?? 0)
        return {
            counter,
            decorations: [
                ...out.decorations,
                {
                    from: decorationStart,
                    to: decorationEnd,
                    type: 'syntax',
                },
                ...(decorationClosing ? [decorationClosing] : []),
            ],
            nodes: [
                {
                    from,
                    to,
                    type: NodeType.Heading,
                    marks: out.nodes,
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
            nodes: [{ from, to, type: NodeType.Paragraph, marks: out.nodes }],
        }
    }

    parseInline(tree: UnistNode[], counter: number) {
        const decorations: Decoration[] = []
        const nodes: Mark[] = []

        for (const node of tree) {
            const { type, children } = <Parent>node
            const syntaxLength = getInlineSyntaxLength(type)

            switch (type) {
                case NodeType.InlineCode: {
                    const from = counter
                    const decorationStart = from
                    const value = <string>(<Literal>node).value
                    const newLines = getNewLines(value)
                    const offset = newLines.length
                    counter =
                        decorationStart +
                        syntaxLength +
                        value.length +
                        syntaxLength +
                        offset
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
                    nodes.push({ from, to, type })
                    break
                }
                case NodeType.Delete:
                case NodeType.Emphasis:
                case NodeType.Strong: {
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
                    nodes.push(...out.nodes, { from, to, type })
                    break
                }
                case NodeType.Text: {
                    const value = <string>(<Literal>node).value
                    const newLines = getNewLines(value)
                    const offset = newLines.length
                    counter = counter + value.length + offset
                    break
                }
                default: {
                    throw new Error(
                        `Inline node with "${type}" type was not found.`,
                    )
                }
            }
        }
        return { decorations, counter, nodes }
    }
}

export type { Decoration, Mark, Node }
export { NodeType }
export default Parser
