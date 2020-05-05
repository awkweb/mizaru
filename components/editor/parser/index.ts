import {
    MarkedOptions,
    Renderer,
    Slugger,
    TextRenderer,
    defaults,
} from 'marked'
// @ts-ignore
import { unescape } from 'marked/src/helpers'

type MarkedToken = {
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

/**
 * Parsing & Compiling
 */
class Parser {
    options: MarkedOptions
    slugger: Slugger
    renderer: Renderer
    textRenderer: TextRenderer
    counter: number
    marks: { from: number; to: number; type: string }[]
    decorations: { from: number; to: number }[]

    constructor(options: MarkedOptions) {
        this.options = options || defaults
        this.options.renderer = this.options.renderer || new Renderer()
        this.renderer = this.options.renderer
        this.renderer.options = this.options
        this.textRenderer = new TextRenderer()
        this.slugger = new Slugger()
        this.counter = 0
        this.marks = []
        this.decorations = []
    }

    /**
     * Static Parse Method
     */
    static parse(tokens: MarkedToken[], options: MarkedOptions) {
        const parser = new Parser(options)
        return parser.parse(tokens)
    }

    /**
     * Parse Loop
     */
    parse(tokens: MarkedToken[], top = true) {
        let out = '',
            i,
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
                    if (this.options.silent) {
                        console.error(errMsg)
                        return
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
            const from = this.counter + 1
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
                    // out += renderer.link(
                    //     (token as MarkedLinkToken).href,
                    //     (token as MarkedLinkToken).title,
                    //     this.parseInline(token.tokens, renderer),
                    // )
                    this.counter += 1 // [
                    this.parseInline(token.tokens)
                    const decorationClosingStart = this.counter + 1
                    this.counter += 2 // ](
                    this.counter += (token as MarkedLinkToken).href.length
                    if ((token as MarkedLinkToken).title) {
                        this.counter += 1
                        this.counter += (token as MarkedLinkToken).title.length
                        this.counter += 1
                    }
                    this.counter += 1 // )
                    this.marks.push({
                        from,
                        to: this.counter,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from,
                        },
                        { from: decorationClosingStart, to: this.counter },
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
                    this.counter += 2
                    this.parseInline(token.tokens)
                    this.counter += 2
                    this.marks.push({
                        from,
                        to: this.counter,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from + 1,
                        },
                        { from: this.counter - 1, to: this.counter },
                    )
                    break
                }
                case 'del':
                case 'em': {
                    this.counter += 1
                    this.parseInline(token.tokens)
                    this.counter += 1
                    this.marks.push({
                        from,
                        to: this.counter,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from,
                        },
                        { from: this.counter, to: this.counter },
                    )
                    break
                }
                case 'codespan': {
                    this.counter += 1
                    this.counter += token.text.length
                    this.counter += 1
                    this.marks.push({
                        from,
                        to: this.counter,
                        type,
                    })
                    this.decorations.push(
                        {
                            from,
                            to: from,
                        },
                        { from: this.counter, to: this.counter },
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
                    if (this.options.silent) {
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
