import { Slugger } from 'marked'
// @ts-ignore
import { unescape } from 'marked/src/helpers'

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

type MarkedCodeToken = MarkedToken & {
    lang: string
    escaped: boolean
}

type MarkedListToken = MarkedToken & {
    ordered: boolean
    start: boolean
    loose: boolean
    items: MarkedToken[]
}

type MarkedListItemToken = MarkedListToken & {
    checked: boolean
    task: boolean
}

type MarkedLinkToken = MarkedToken & {
    href: string
    title: string
}

export type Marks = {
    from: number
    to: number
    type: string
    attrs?: { [key: string]: any }
}[]
export type Decorations = { from: number; to: number; type?: string }[]

interface Props {
    offset: number
    silent: boolean
}

/**
 * Parsing & Compiling
 */
class Parser {
    props: Props
    slugger: Slugger
    counter: number
    marks: Marks
    decorations: Decorations

    constructor(props: Partial<Props>) {
        this.props = { offset: 1, silent: true, ...props }
        this.slugger = new Slugger()
        this.counter = this.props.offset
        this.marks = []
        this.decorations = []
    }

    /**
     * Static Parse Method
     */
    static parse(
        tokens: MarkedToken[],
        props: Props,
    ): { decorations: Decorations; marks: Marks } {
        const parser = new Parser(props)
        return parser.parse(tokens)
    }

    /**
     * Parse Loop
     */
    parse(
        tokens: MarkedToken[],
        top = true,
    ): { decorations: Decorations; marks: Marks } {
        let i,
            j,
            l2,
            body,
            token,
            ordered,
            start,
            loose,
            itemBody,
            item,
            checked,
            task,
            checkbox

        const l = tokens.length
        for (i = 0; i < l; i++) {
            token = tokens[i] as MarkedToken
            switch (token.type) {
                case 'space': {
                    continue
                }
                // case 'hr': {
                //     out += this.renderer.hr()
                //     continue
                // }
                // case 'heading': {
                //     out += this.renderer.heading(
                //         this.parseInline(token.tokens),
                //         (token as MarkedHeadingToken).depth,
                //         unescape(
                //             this.parseInline(token.tokens, this.textRenderer),
                //         ),
                //         this.slugger,
                //     )
                //     continue
                // }
                // case 'code': {
                //     out += this.renderer.code(
                //         token.text,
                //         (token as MarkedCodeToken).lang,
                //         (token as MarkedCodeToken).escaped,
                //     )
                //     continue
                // }
                // case 'blockquote': {
                //     body = this.parse(token.tokens)
                //     out += this.renderer.blockquote(body)
                //     continue
                // }
                // case 'list': {
                //     token = token as MarkedListToken
                //     ordered = token.ordered
                //     start = token.start
                //     loose = token.loose
                //     l2 = token.items.length
                //
                //     body = ''
                //     for (j = 0; j < l2; j++) {
                //         item = token.items[j] as MarkedListItemToken
                //         checked = item.checked
                //         task = item.task
                //
                //         itemBody = ''
                //         if (item.task) {
                //             checkbox = this.renderer.checkbox(checked)
                //             if (loose) {
                //                 if (item.tokens[0].type === 'text') {
                //                     item.tokens[0].text =
                //                         checkbox + ' ' + item.tokens[0].text
                //                     if (
                //                         item.tokens[0].tokens &&
                //                         item.tokens[0].tokens.length > 0 &&
                //                         item.tokens[0].tokens[0].type === 'text'
                //                     ) {
                //                         item.tokens[0].tokens[0].text =
                //                             checkbox +
                //                             ' ' +
                //                             item.tokens[0].tokens[0].text
                //                     }
                //                 } else {
                //                     item.tokens.unshift({
                //                         type: 'text',
                //                         text: checkbox,
                //                         tokens: [],
                //                     })
                //                 }
                //             } else {
                //                 itemBody += checkbox
                //             }
                //         }
                //
                //         itemBody += this.parse(item.tokens, loose)
                //         body += this.renderer.listitem(itemBody, task, checked)
                //     }
                //
                //     out += this.renderer.list(body, ordered, start)
                //     continue
                // }
                // case 'html': {
                //     // TODO parse inline content if parameter markdown=1
                //     out += this.renderer.html(token.text)
                //     continue
                // }
                case 'paragraph': {
                    // out += this.renderer.paragraph(
                    //     this.parseInline(token.tokens),
                    // )
                    this.parseInline(token.tokens)
                    continue
                }
                // case 'text': {
                //     body = token.tokens
                //         ? this.parseInline(token.tokens)
                //         : token.text
                //     while (i + 1 < l && tokens[i + 1].type === 'text') {
                //         token = tokens[++i] as MarkedToken
                //         body +=
                //             '\n' +
                //             (token.tokens
                //                 ? this.parseInline(token.tokens)
                //                 : token.text)
                //     }
                //     out += top ? this.renderer.paragraph(body) : body
                //     continue
                // }
                default: {
                    const errMsg = `Token with "${token.type}" type was not found.`
                    if (this.props.silent) {
                        console.error(errMsg)
                        return {
                            marks: [],
                            decorations: [],
                        }
                    } else {
                        throw new Error(errMsg)
                    }
                }
            }
        }

        return { marks: this.marks, decorations: this.decorations }
    }

    /**
     * Parse Inline Tokens
     */
    parseInline(tokens: MarkedToken[]) {
        let i, token

        const l = tokens.length
        for (i = 0; i < l; i++) {
            token = tokens[i]
            const from = this.counter
            const type = token.type
            switch (type) {
                // case 'escape': {
                //     out += renderer.text(token.text)
                //     break
                // }
                // case 'html': {
                //     out += renderer.html(token.text)
                //     break
                // }
                case 'link': {
                    this.counter += 1 // [
                    this.parseInline(token.tokens)
                    const decorationClosingStart = this.counter
                    this.counter += 2 // ](
                    const { href, title } = token as MarkedLinkToken
                    this.counter += href.length
                    if (title) {
                        this.counter += 1
                        this.counter += title.length
                        this.counter += 1
                    }
                    this.counter += 1 // )
                    const to = this.counter
                    this.marks.push({
                        from,
                        to,
                        type,
                        attrs: {
                            title,
                            href,
                        },
                    })
                    this.decorations.push(
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
                    )
                    break
                }
                // case 'image': {
                //     out += renderer.image(
                //         (token as MarkedLinkToken).href,
                //         (token as MarkedLinkToken).title,
                //         token.text,
                //     )
                //     break
                // }
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
                // case 'br': {
                //     out += renderer.br()
                //     break
                // }
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
