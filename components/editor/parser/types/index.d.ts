import { Parent } from 'unist'

export interface Heading extends Parent {
    type: 'heading'
    depth: number
}

export interface List extends Parent {
    type: 'list'
    ordered: boolean
    spread: boolean
    start?: number
}

export interface ListItem extends Parent {
    type: 'listItem'
    checked?: boolean
    num?: number
    spread: boolean
}

export interface Link extends Parent {
    type: 'link'
    title?: string
    url: string
}

export interface Position {
    from: number
    to: number
}

export interface Element {
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
