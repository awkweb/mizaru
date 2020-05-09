// @ts-ignore
import { inline } from 'marked/src/rules'

import { DecorationType } from '../types'

export type MarkedToken = {
    type: string
    text: string
    raw: string
    tokens: MarkedToken[]
}

type MarkedHeadingToken = MarkedToken & {
    depth: number
}

type MarkedLinkToken = MarkedToken & {
    href: string
    title: string
}

export type Decorations = { from: number; to: number; type?: string }[]
export type Marks = {
    from: number
    to: number
    type: string
    attrs?: { [key: string]: any }
}[]
export type Nodes = {
    from: number
    to: number
    type: string
    attrs?: { [key: string]: any }
}[]

interface Props {
    offset: number
    silent: boolean
}

class Parser {
    props: Props
    counter: number
    decorations: Decorations
    marks: Marks
    nodes: Nodes

    constructor(props: Partial<Props>) {
        this.props = { offset: 1, silent: true, ...props }
        this.counter = this.props.offset
        this.decorations = []
        this.marks = []
        this.nodes = []
    }

    parse(
        tokens: MarkedToken[],
    ): { decorations: Decorations; marks: Marks; nodes: Nodes } {
        let i, token

        const l = tokens.length
        for (i = 0; i < l; i++) {
            token = tokens[i] as MarkedToken
            switch (token.type) {
                case 'space': {
                    continue
                }
                case 'heading': {
                    this.nodes.push({
                        from: this.counter,
                        to: this.counter,
                        type: 'heading',
                        attrs: {
                            level: (token as MarkedHeadingToken).depth,
                        },
                    })
                    this.counter += token.raw.length
                    this.parseInline(token.tokens)
                    continue
                }
                case 'hr': {
                    this.nodes.push({
                        from: this.counter,
                        to: this.counter,
                        type: 'hr',
                    })
                    continue
                }
                case 'paragraph': {
                    this.nodes.push({
                        from: this.counter,
                        to: this.counter,
                        type: 'paragraph',
                    })
                    this.parseInline(token.tokens)
                    continue
                }
                default: {
                    const errMsg = `Token with "${token.type}" type was not found.`
                    if (this.props.silent) {
                        console.error(errMsg)
                        return {
                            decorations: [],
                            marks: [],
                            nodes: [],
                        }
                    } else {
                        throw new Error(errMsg)
                    }
                }
            }
        }

        return {
            decorations: this.decorations,
            marks: this.marks,
            nodes: this.nodes,
        }
    }

    parseInline(tokens: MarkedToken[]) {
        let i, token

        const l = tokens.length
        for (i = 0; i < l; i++) {
            token = tokens[i]
            const from = this.counter
            const type = token.type
            switch (type) {
                case 'codespan': {
                    const syntaxCharLength = 1
                    this.counter += syntaxCharLength
                    this.counter += token.text.length
                    this.counter += syntaxCharLength
                    const to = this.counter
                    this.marks.push({
                        from,
                        to,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from + syntaxCharLength,
                        },
                        {
                            from: this.counter - syntaxCharLength,
                            to,
                        },
                    )
                    break
                }
                case 'del': {
                    const syntaxCharLength = 1
                    this.counter += syntaxCharLength
                    this.parseInline(token.tokens)
                    this.counter += syntaxCharLength
                    const to = this.counter
                    this.marks.push({
                        from,
                        to,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from + syntaxCharLength,
                            type: DecorationType.Syntax,
                        },
                        {
                            from: from + syntaxCharLength,
                            to: this.counter - syntaxCharLength,
                            type: DecorationType.Preview,
                        },
                        {
                            from: this.counter - syntaxCharLength,
                            to,
                            type: DecorationType.Syntax,
                        },
                    )
                    break
                }
                case 'em': {
                    const syntaxCharLength = 1
                    this.counter += syntaxCharLength
                    this.parseInline(token.tokens)
                    this.counter += syntaxCharLength
                    const to = this.counter
                    this.marks.push({
                        from,
                        to,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from + syntaxCharLength,
                        },
                        {
                            from: this.counter - syntaxCharLength,
                            to,
                        },
                    )
                    break
                }
                case 'link': {
                    const { href, title } = token as MarkedLinkToken
                    let decorations: Decorations
                    let to: number
                    if (inline.gfm.url.test(token.raw)) {
                        // Need to use raw because of mangling
                        this.counter += token.raw.length
                        to = this.counter
                        decorations = [
                            {
                                from,
                                to,
                                type: DecorationType.Preview,
                            },
                        ]
                    } else if (inline.autolink.test(token.raw)) {
                        const syntaxCharLength = 1 // <
                        this.counter += token.raw.length
                        to = this.counter
                        decorations = [
                            {
                                from,
                                to: from + syntaxCharLength,
                                type: DecorationType.Syntax,
                            },
                            {
                                from: from + syntaxCharLength,
                                to: this.counter - syntaxCharLength,
                                type: DecorationType.Preview,
                            },
                            {
                                from: this.counter - syntaxCharLength,
                                to,
                                type: DecorationType.Syntax,
                            },
                        ]
                    } else {
                        this.counter += 1 // [
                        this.parseInline(token.tokens)
                        const decorationClosingStart = this.counter
                        this.counter += 2 // ](
                        this.counter += href.length
                        if (title) {
                            this.counter += 2 // space"'(
                            this.counter += title.length
                            this.counter += 1 // "')
                        }
                        this.counter += 1 // )
                        to = this.counter
                        decorations = [
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
                    this.marks.push({
                        from,
                        to,
                        type,
                        attrs: {
                            title,
                            href,
                        },
                    })
                    this.decorations.push(...decorations)
                    break
                }
                case 'strong': {
                    const syntaxCharLength = 2
                    this.counter += syntaxCharLength
                    this.parseInline(token.tokens)
                    this.counter += syntaxCharLength
                    const to = this.counter
                    this.marks.push({
                        from,
                        to,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from + syntaxCharLength,
                        },
                        {
                            from: this.counter - syntaxCharLength,
                            to,
                        },
                    )
                    break
                }
                case 'text': {
                    this.counter += token.text.length
                    break
                }
                default: {
                    const errMsg = `Token with "${token.type}" type was not found.`
                    if (this.props.silent) {
                        console.error(errMsg)
                        return
                    } else {
                        throw new Error(errMsg)
                    }
                }
            }
        }
    }
}

export default Parser
