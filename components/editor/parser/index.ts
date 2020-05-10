// @ts-ignore
import { inline } from 'marked/src/rules'

import {
    Decoration,
    Mark,
    MarkedHeadingToken,
    MarkedLinkToken,
    MarkedToken,
    Node,
} from './types'
import { DecorationType } from '../types'

interface Props {
    offset: number
}

class Parser {
    props: Props = {
        offset: 0,
    }

    constructor(props: Partial<Props>) {
        this.props = { ...this.props, ...props }
    }

    static parse(tokens: MarkedToken[], props: Partial<Props>) {
        const parser = new Parser(props)
        return parser.parse(tokens)
    }

    parse(tokens: MarkedToken[]): { decorations: Decoration[]; nodes: Node[] } {
        const nodes: Node[] = []
        const decorations: Decoration[] = []
        const from = this.props.offset

        // Hoist declarations outside loop if speed is an issue
        // Currently kept for readability
        const l = tokens.length
        for (let i = 0; i < l; i++) {
            const token = tokens[i] as MarkedToken
            const type = token.type
            switch (type) {
                case 'heading': {
                    const { depth: level } = token as MarkedHeadingToken
                    const syntaxLength = from + level + 2
                    const out = this.parseInline(token.tokens, syntaxLength)
                    const to = out.counter + 1

                    const node = {
                        from,
                        to,
                        type,
                        marks: out.marks,
                        attrs: {
                            level,
                        },
                    }
                    const decoration = { from, to: syntaxLength }
                    nodes.push(...nodes, node)
                    decorations.push(decoration, ...out.decorations)
                    continue
                }
                case 'paragraph': {
                    const out = this.parseInline(token.tokens, from + 1)
                    const to = out.counter + 1

                    const node = { from, to, type, marks: out.marks }
                    nodes.push(...nodes, node)
                    decorations.push(...out.decorations)
                    continue
                }
                case 'space': {
                    continue
                }
                default: {
                    const errMsg = `Token with "${token.type}" type was not found.`
                    throw new Error(errMsg)
                }
            }
        }

        return {
            decorations,
            nodes,
        }
    }

    parseInline(
        tokens: MarkedToken[],
        counter: number,
    ): { decorations: Decoration[]; marks: Mark[]; counter: number } {
        const decorations: Decoration[] = []
        const marks: Mark[] = []

        const l = tokens.length
        for (let i = 0; i < l; i++) {
            const token = tokens[i]
            const type = token.type
            const from = counter
            switch (type) {
                case 'codespan': {
                    const syntax = '`'
                    const syntaxLength = syntax.length
                    counter =
                        counter +
                        syntaxLength +
                        token.text.length +
                        syntaxLength
                    const to = counter

                    const mark = { from, to, type }
                    const decoration = [
                        {
                            from,
                            to: from + syntaxLength,
                        },
                        {
                            from: to - syntaxLength,
                            to,
                        },
                    ]
                    marks.push(mark)
                    decorations.push(...decoration)
                    break
                }
                case 'del': {
                    const syntax = '~'
                    const syntaxLength = syntax.length
                    counter = counter + syntaxLength
                    const out = this.parseInline(token.tokens, counter)
                    counter = out.counter + syntaxLength
                    const to = counter

                    const mark = { from, to, type }
                    const decoration = [
                        {
                            from,
                            to: from + syntaxLength,
                            type: DecorationType.Syntax,
                        },
                        {
                            from: from + syntaxLength,
                            to: to - syntaxLength,
                            type: DecorationType.Preview,
                        },
                        {
                            from: to - syntaxLength,
                            to,
                            type: DecorationType.Syntax,
                        },
                    ]
                    marks.push(...out.marks, mark)
                    decorations.push(...out.decorations, ...decoration)
                    break
                }
                case 'em': {
                    const syntax = '*'
                    const syntaxLength = syntax.length
                    counter = counter + syntaxLength
                    const out = this.parseInline(token.tokens, counter)
                    counter = out.counter + syntaxLength
                    const to = counter

                    const mark = { from, to, type }
                    const decoration = [
                        {
                            from,
                            to: from + syntaxLength,
                        },
                        {
                            from: to - syntaxLength,
                            to,
                        },
                    ]
                    marks.push(...out.marks, mark)
                    decorations.push(...out.decorations, ...decoration)
                    break
                }
                case 'link': {
                    const { href, title } = token as MarkedLinkToken
                    let decoration: Decoration[]
                    let out = {} as {
                        decorations: Decoration[]
                        marks: Mark[]
                        counter: number
                    }
                    let to
                    if (inline.gfm.url.test(token.raw)) {
                        // Need to use raw because of mangling
                        counter += token.raw.length
                        to = counter
                        decoration = [
                            {
                                from,
                                to,
                                type: DecorationType.Preview,
                            },
                        ]
                    } else if (inline.autolink.test(token.raw)) {
                        const syntax = '<'
                        const syntaxLength = syntax.length
                        counter += token.raw.length
                        to = counter
                        decoration = [
                            {
                                from,
                                to: from + syntaxLength,
                                type: DecorationType.Syntax,
                            },
                            {
                                from: from + syntaxLength,
                                to: to - syntaxLength,
                                type: DecorationType.Preview,
                            },
                            {
                                from: to - syntaxLength,
                                to,
                                type: DecorationType.Syntax,
                            },
                        ]
                    } else {
                        // Adding on opening [
                        counter = counter + 1
                        const out = this.parseInline(token.tokens, counter)
                        const decorationClosingStart = out.counter
                        // Adding on `](href.length`
                        counter = decorationClosingStart + 2 + href.length
                        if (title) {
                            // Adding on ` "title.length"`
                            counter = counter + 2 + title.length + 1
                        }
                        // Adding on closing )
                        counter = counter + 1 // )
                        to = counter
                        decoration = [
                            {
                                from,
                                to: from + 1,
                                type: DecorationType.Syntax,
                            },
                            {
                                from: from + 1,
                                to: decorationClosingStart,
                                type: DecorationType.Preview,
                            },

                            {
                                from: decorationClosingStart,
                                to,
                                type: DecorationType.Syntax,
                            },
                        ]
                    }

                    const mark = {
                        from,
                        to,
                        type,
                        attrs: {
                            title,
                            href,
                        },
                    }
                    marks.push(...(out?.marks ?? []), mark)
                    decorations.push(...(out?.decorations ?? []), ...decoration)
                    break
                }
                case 'strong': {
                    const syntax = '**'
                    const syntaxLength = syntax.length
                    counter = counter + syntaxLength
                    const out = this.parseInline(token.tokens, counter)
                    counter = out.counter + syntaxLength
                    const to = counter

                    const mark = { from, to, type }
                    const decoration = [
                        {
                            from,
                            to: from + syntaxLength,
                        },
                        {
                            from: to - syntaxLength,
                            to,
                        },
                    ]
                    marks.push(...out.marks, mark)
                    decorations.push(...out.decorations, ...decoration)
                    break
                }
                case 'text': {
                    counter += token.text.length
                    break
                }
                default: {
                    const errMsg = `Token with "${token.type}" type was not found.`
                    throw new Error(errMsg)
                }
            }
        }

        return { decorations, marks, counter }
    }
}

export default Parser
export type { Decoration, Mark, Node }
