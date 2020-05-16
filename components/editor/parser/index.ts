/* eslint-disable */
import remark, { PartialRemarkOptions } from 'remark'
import modifyChildren from 'unist-util-modify-children'
// @ts-ignore
import source from 'unist-util-source'
import { Parent, Node as UnistNode, Literal } from 'unist'
/* eslint-enable */

import { Decoration, Heading, Link, List, ListItem, Mark, Node } from './types'

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
        const settings = <PartialRemarkOptions>{ gfm: true, position: true }
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
                    counter = counter + 1
                    const out = this.parseBlock(children, counter, syntaxLength)
                    counter = out.counter + 1
                    const to = counter
                    const decorationStart = from + 2
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

                    continue
                }
                case 'heading': {
                    const { depth: level } = <Heading>node
                    const syntaxLength = level + 1
                    const decorationStart = from + 1
                    counter = decorationStart + syntaxLength
                    const out = this.parseInline(children, counter)
                    counter = out.counter + 1
                    const to = counter
                    decorations.push(...out.decorations, {
                        from: decorationStart,
                        to: decorationStart + syntaxLength,
                        type: 'syntax',
                    })
                    nodes.push({
                        from,
                        to,
                        type,
                        marks: out.marks,
                        attrs: { level },
                    })
                    continue
                }
                case 'list': {
                    const modify = modifyChildren(this.modifyListItem)
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
                    continue
                }
                case 'listItem': {
                    const syntaxLength = this.getListItemSyntaxLength(
                        <ListItem>node,
                    )
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
                    continue
                }
                case 'paragraph': {
                    counter = counter + 1
                    const out = this.parseInline(
                        children,
                        counter + (boost ?? 0),
                    )
                    counter = out.counter + 1
                    const to = counter
                    decorations.push(...out.decorations)
                    nodes.push({ from, to, type, marks: out.marks })
                    continue
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

    parseInline(nodes: UnistNode[], counter: number) {
        const decorations: Decoration[] = []
        const marks: Mark[] = []

        for (const node of nodes) {
            const { type, children } = <Parent>node
            const syntaxLength = this.getInlineSyntaxLength(type)

            switch (type) {
                case 'inlineCode': {
                    const from = counter
                    const decorationStart = from + 1
                    counter =
                        decorationStart +
                        syntaxLength +
                        ((<Literal>node).value as string).length +
                        syntaxLength
                    const decorationEnd = counter
                    counter = counter + 1
                    const to = counter
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
                    continue
                }
                case 'delete':
                case 'emphasis':
                case 'strong': {
                    const from = counter
                    const decorationStart = from + 1
                    counter = decorationStart + syntaxLength
                    const out = this.parseInline(children, counter)
                    counter = out.counter + syntaxLength
                    const decorationEnd = counter
                    counter = counter + 1
                    const to = counter
                    decorations.push(
                        ...out.decorations,
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
                    marks.push(...out.marks, { from, to, type })
                    continue
                }
                case 'link': {
                    const { url, title } = <Link>node
                    const linkType = this.getLinkType(<Link>node)
                    continue
                }
                case 'text': {
                    counter = counter + ((<Literal>node).value as string).length
                    continue
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

    private getInlineSyntaxLength(type: string) {
        switch (type) {
            case 'delete':
            case 'strong':
                return 2
            case 'emphasis':
            case 'inlineCode':
                return 1
            default:
                return 0
        }
    }

    private getListItemSyntaxLength(node: ListItem) {
        const { checked, num } = node
        let syntaxLength = 2
        if (typeof num === 'number') {
            syntaxLength = `${num}. `.length
        }
        if (checked !== null) {
            const boxLength = (checked ? `[x]` : `[ ]`).length + 1
            syntaxLength = syntaxLength + boxLength
        }
        return syntaxLength
    }

    private modifyListItem(node: UnistNode, index: number, parent: Parent) {
        const { start } = <List>parent
        const num = typeof start === 'number' ? start + index : null
        parent.children.splice(index, 1, { ...node, num })
    }

    private getLinkType(node: Link) {
        const raw = this.getRawText(node)
        return 'default'
    }

    private getRawText(node: UnistNode) {
        return source(node, this.doc)
    }
}

export default Parser
