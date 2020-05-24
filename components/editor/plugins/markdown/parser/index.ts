/* eslint-disable */
import unified from 'unified'
import remarkParse from 'remark-parse'
import { Node as UnistNode, Literal } from 'unist'
/* eslint-enable */
// @ts-ignore
import remarkDisableTokenizers from 'remark-disable-tokenizers'

import {
    BlankLine,
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
    getBlockquoteWhitespace,
    getHeadingWhitespace,
    getInlineSyntaxLength,
    getNewLines,
    toMDZAST,
} from './utils'
import { blankLine } from './tokenize'

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

    static toContent(lines: string[]) {
        return lines.join('\n').replace(/(\\)/g, '\\\\')
    }

    parse(doc: string) {
        // @ts-ignore
        const tokenizers = remarkParse.Parser.prototype.blockTokenizers
        tokenizers.blankLine = blankLine

        const markdown = unified()
            .use(remarkParse, {
                commonmark: true,
                gfm: true,
            })
            .use(remarkDisableTokenizers, {
                inline: ['break'],
            })
            .parse(doc)
        const tree = <Parent>toMDZAST({ doc })(markdown)
        // console.log(tree.children[0])
        const out = this.parseBlock(tree.children, this.props.offset)
        // console.log(out)

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
                case 'blankLine': {
                    const { count } = <BlankLine>node
                    if (count % 2 === 0) {
                        counter = counter + count
                    } else {
                        counter = counter + count - 1
                    }
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
        const syntaxLength = (leading?.length ?? 0) + (inner?.length ?? 0) + 1
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
                    type: 'blockquote',
                },
            ],
        }
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
        let decorationClosing
        if (trailing) {
            const trimmed = raw.trim()
            const value =
                trimmed === syntaxChars
                    ? trailing.slice(0, trailing.length - 1)
                    : trailing
            const child = { type: 'text', value }
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
            const child = { type: 'text', value: inner }
            children.unshift(child)
        }

        const syntaxLength = (leading?.length ?? 0) + level + 1
        const decorationStart = from + 1
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
                    const value = <string>(<Literal>node).value
                    const newLines = getNewLines(value)
                    const offset = newLines.length
                    const backslashes = value.match(/(\\)/g) || []
                    const backslashOffset = backslashes
                        ? backslashes.length / 2
                        : 0
                    counter =
                        decorationStart +
                        syntaxLength +
                        value.length +
                        syntaxLength +
                        offset -
                        backslashOffset
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
                case 'text': {
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
        return { decorations, counter, marks }
    }
}

export type { Decoration, Heading, Link, List, ListItem, Mark, Node }
export default Parser
