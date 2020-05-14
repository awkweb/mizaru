/* eslint-disable */
import remark from 'remark'
import removePosition from 'unist-util-remove-position'
import modifyChildren from 'unist-util-modify-children'
import { Parent, Node as UnistNode, Literal } from 'unist'
/* eslint-enable */

interface Heading extends Parent {
    type: 'heading'
    depth: number
}
interface List extends Parent {
    type: 'list'
    ordered: boolean
    spread: boolean
    start?: number
}
interface ListItem extends Parent {
    type: 'listItem'
    checked?: boolean
    num?: number
    spread: boolean
}
export interface Position {
    from: number
    to: number
}
export interface Element extends Position {
    type: string
    [key: string]: unknown
}
export interface Mark extends Element {}
export interface Node extends Element {
    marks: Mark[]
}
export interface Decoration extends Position {
    type: string
}

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
        const tree = removePosition(remark().parse(doc), true)
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
                    const syntaxLength = from + 2
                    const out = this.parseBlock(
                        children,
                        counter + 1,
                        syntaxLength,
                    )
                    counter = out.counter + 1
                    const to = counter
                    nodes.push(...out.nodes, {
                        from,
                        to,
                        type,
                        marks: [],
                    })
                    decorations.push(...out.decorations, {
                        from: from + 1,
                        to: syntaxLength * 2,
                        type: 'syntax',
                    })
                    continue
                }
                case 'heading': {
                    const { depth: level } = <Heading>node
                    const syntaxLength = from + 1 + level + 1
                    const out = this.parseInline(children, syntaxLength)
                    counter = out.counter + 1
                    const to = counter
                    nodes.push({
                        from,
                        to,
                        type,
                        marks: out.marks,
                        attrs: { level },
                    })
                    decorations.push(...out.decorations, {
                        from,
                        to: syntaxLength,
                        type: 'syntax',
                    })
                    continue
                }
                case 'list': {
                    const modify = modifyChildren(this.modifyChildren)
                    modify(node)
                    const { ordered, spread, start } = <List>node
                    const out = this.parseBlock(children, counter + 1)
                    counter = out.counter + 1
                    const to = counter
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
                case 'listItem':
                    const { checked, spread, num } = <ListItem>node
                    let syntaxLength = 2
                    if (typeof num === 'number') {
                        syntaxLength = `${num}. `.length
                    }
                    const out = this.parseBlock(
                        children,
                        counter + 1,
                        syntaxLength,
                    )
                    counter = out.counter + 1
                    const to = counter
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
                    decorations.push(...out.decorations, {
                        from: from + 1,
                        to: from + 2 + syntaxLength,
                        type: 'syntax',
                    })
                    continue
                case 'paragraph': {
                    const out = this.parseInline(
                        children,
                        counter + 1 + (boost ?? 0),
                    )
                    counter = out.counter + 1
                    const to = counter
                    nodes.push({ from, to, type, marks: out.marks })
                    decorations.push(...out.decorations)
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
            const from = counter
            const syntaxLength = this.getSyntaxLength(type)

            switch (type) {
                case 'inlineCode': {
                    counter =
                        counter +
                        syntaxLength +
                        ((<Literal>node).value as string).length +
                        syntaxLength
                    const to = counter
                    decorations.push(
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
                    marks.push({ from, to, type })
                    continue
                }
                case 'delete':
                case 'emphasis':
                case 'strong': {
                    counter = counter + syntaxLength
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

    private getSyntaxLength(type: string) {
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

    private modifyChildren(node: UnistNode, index: number, parent: Parent) {
        if (node.type === 'listItem') {
            const { start } = <List>parent
            const num = typeof start === 'number' ? start + index : null
            parent.children.splice(index, 1, { ...node, num })
            return index + 1
        }
    }
}

// class Parser {
//     props: Props = {
//         offset: 0,
//     }
//
//     constructor(props: Partial<Props>) {
//         this.props = { ...this.props, ...props }
//     }
//
//     static parse(tokens: MarkedToken[], props: Partial<Props>) {
//         const parser = new Parser(props)
//         return parser.parse(tokens)
//     }
//
//     parse(tokens: MarkedToken[]): { decorations: Decoration[]; nodes: Node[] } {
//         const nodes: Node[] = []
//         const decorations: Decoration[] = []
//         const from = this.props.offset
//
//         // Hoist declarations outside loop if speed is an issue
//         // Currently kept for readability
//         const l = tokens.length
//         for (let i = 0; i < l; i++) {
//             const token = tokens[i] as MarkedToken
//             const type = token.type
//             switch (type) {
//                 case 'heading': {
//                     const { depth: level } = token as MarkedHeadingToken
//                     const syntaxLength = from + level + 2
//                     const out = this.parseInline(token.tokens, syntaxLength)
//                     const to = out.counter + 1
//
//                     const node = {
//                         from,
//                         to,
//                         type,
//                         marks: out.marks,
//                         attrs: {
//                             level,
//                         },
//                     }
//                     const decoration = { from, to: syntaxLength }
//                     nodes.push(...nodes, node)
//                     decorations.push(decoration, ...out.decorations)
//                     continue
//                 }
//                 case 'paragraph': {
//                     const out = this.parseInline(token.tokens, from + 1)
//                     const to = out.counter + 1
//
//                     const node = { from, to, type, marks: out.marks }
//                     nodes.push(...nodes, node)
//                     decorations.push(...out.decorations)
//                     continue
//                 }
//                 case 'space': {
//                     continue
//                 }
//                 default: {
//                     const errMsg = `Token with "${token.type}" type was not found.`
//                     throw new Error(errMsg)
//                 }
//             }
//         }
//
//         return {
//             decorations,
//             nodes,
//         }
//     }
//
//     parseInline(
//         tokens: MarkedToken[],
//         counter: number,
//     ): { decorations: Decoration[]; marks: Mark[]; counter: number } {
//         const decorations: Decoration[] = []
//         const marks: Mark[] = []
//
//         const l = tokens.length
//         for (let i = 0; i < l; i++) {
//             const token = tokens[i]
//             const type = token.type
//             const from = counter
//             switch (type) {
//                 case 'codespan': {
//                     const syntax = '`'
//                     const syntaxLength = syntax.length
//                     counter =
//                         counter +
//                         syntaxLength +
//                         token.text.length +
//                         syntaxLength
//                     const to = counter
//
//                     const mark = { from, to, type }
//                     const decoration = [
//                         {
//                             from,
//                             to: from + syntaxLength,
//                         },
//                         {
//                             from: to - syntaxLength,
//                             to,
//                         },
//                     ]
//                     marks.push(mark)
//                     decorations.push(...decoration)
//                     break
//                 }
//                 case 'del': {
//                     const syntax = '~'
//                     const syntaxLength = syntax.length
//                     counter = counter + syntaxLength
//                     const out = this.parseInline(token.tokens, counter)
//                     counter = out.counter + syntaxLength
//                     const to = counter
//
//                     const mark = { from, to, type }
//                     const decoration = [
//                         {
//                             from,
//                             to: from + syntaxLength,
//                             type: DecorationType.Syntax,
//                         },
//                         {
//                             from: from + syntaxLength,
//                             to: to - syntaxLength,
//                             type: DecorationType.Preview,
//                         },
//                         {
//                             from: to - syntaxLength,
//                             to,
//                             type: DecorationType.Syntax,
//                         },
//                     ]
//                     marks.push(...out.marks, mark)
//                     decorations.push(...out.decorations, ...decoration)
//                     break
//                 }
//                 case 'em': {
//                     const syntax = '*'
//                     const syntaxLength = syntax.length
//                     counter = counter + syntaxLength
//                     const out = this.parseInline(token.tokens, counter)
//                     counter = out.counter + syntaxLength
//                     const to = counter
//
//                     const mark = { from, to, type }
//                     const decoration = [
//                         {
//                             from,
//                             to: from + syntaxLength,
//                         },
//                         {
//                             from: to - syntaxLength,
//                             to,
//                         },
//                     ]
//                     marks.push(...out.marks, mark)
//                     decorations.push(...out.decorations, ...decoration)
//                     break
//                 }
//                 case 'link': {
//                     const { href, title } = token as MarkedLinkToken
//                     let decoration: Decoration[]
//                     let out = {} as {
//                         decorations: Decoration[]
//                         marks: Mark[]
//                         counter: number
//                     }
//                     let to
//                     if (inline.gfm.url.test(token.raw)) {
//                         // Need to use raw because of mangling
//                         counter += token.raw.length
//                         to = counter
//                         decoration = [
//                             {
//                                 from,
//                                 to,
//                                 type: DecorationType.Preview,
//                             },
//                         ]
//                     } else if (inline.autolink.test(token.raw)) {
//                         const syntax = '<'
//                         const syntaxLength = syntax.length
//                         counter += token.raw.length
//                         to = counter
//                         decoration = [
//                             {
//                                 from,
//                                 to: from + syntaxLength,
//                                 type: DecorationType.Syntax,
//                             },
//                             {
//                                 from: from + syntaxLength,
//                                 to: to - syntaxLength,
//                                 type: DecorationType.Preview,
//                             },
//                             {
//                                 from: to - syntaxLength,
//                                 to,
//                                 type: DecorationType.Syntax,
//                             },
//                         ]
//                     } else {
//                         // Adding on opening [
//                         counter = counter + 1
//                         out = this.parseInline(token.tokens, counter)
//                         const decorationClosingStart = out.counter
//                         // Adding on `](href.length`
//                         counter = decorationClosingStart + 2 + href.length
//                         if (title) {
//                             // Adding on ` "title.length"`
//                             counter = counter + 2 + title.length + 1
//                         }
//                         // Adding on closing )
//                         counter = counter + 1 // )
//                         to = counter
//                         decoration = [
//                             {
//                                 from,
//                                 to: from + 1,
//                                 type: DecorationType.Syntax,
//                             },
//                             {
//                                 from: from + 1,
//                                 to: decorationClosingStart,
//                                 type: DecorationType.Preview,
//                             },
//
//                             {
//                                 from: decorationClosingStart,
//                                 to,
//                                 type: DecorationType.Syntax,
//                             },
//                         ]
//                     }
//
//                     const mark = {
//                         from,
//                         to,
//                         type,
//                         attrs: {
//                             title,
//                             href,
//                         },
//                     }
//                     marks.push(...(out?.marks ?? []), mark)
//                     decorations.push(...(out?.decorations ?? []), ...decoration)
//                     break
//                 }
//                 case 'strong': {
//                     const syntax = '**'
//                     const syntaxLength = syntax.length
//                     counter = counter + syntaxLength
//                     const out = this.parseInline(token.tokens, counter)
//                     counter = out.counter + syntaxLength
//                     const to = counter
//
//                     const mark = { from, to, type }
//                     const decoration = [
//                         {
//                             from,
//                             to: from + syntaxLength,
//                         },
//                         {
//                             from: to - syntaxLength,
//                             to,
//                         },
//                     ]
//                     marks.push(...out.marks, mark)
//                     decorations.push(...out.decorations, ...decoration)
//                     break
//                 }
//                 case 'text': {
//                     counter += token.text.length
//                     break
//                 }
//                 default: {
//                     const errMsg = `Token with "${token.type}" type was not found.`
//                     throw new Error(errMsg)
//                 }
//             }
//         }
//
//         return { decorations, marks, counter }
//     }
// }

export default Parser
