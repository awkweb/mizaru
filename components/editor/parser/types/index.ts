export type MarkedToken = {
    type: string
    text: string
    raw: string
    tokens: MarkedToken[]
}

export type MarkedHeadingToken = MarkedToken & {
    depth: number
}

export type MarkedLinkToken = MarkedToken & {
    href: string
    title: string
}

export type Decoration = { from: number; to: number; type?: string }
export type Mark = {
    from: number
    to: number
    type: string
    attrs?: { [key: string]: any }
}
export type Node = {
    from: number
    to: number
    type: string
    attrs?: { [key: string]: any }
    marks?: Mark[]
}
