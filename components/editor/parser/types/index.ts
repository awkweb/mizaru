import { Parent as UnistParent } from 'unist'

export enum NodeType {
    AutoLink = 'autoLink',
    BlankLine = 'blankLine',
    Blockquote = 'blockquote',
    Break = 'break',
    Definition = 'definition',
    Delete = 'delete',
    Email = 'email',
    Emphasis = 'emphasis',
    FencedCode = 'fencedCode',
    HTML = 'html',
    Heading = 'heading',
    IndentedCode = 'indentedCode',
    InlineCode = 'inlineCode',
    Link = 'link',
    List = 'list',
    ListItem = 'listItem',
    Paragraph = 'paragraph',
    Reference = 'reference',
    Root = 'root',
    Strong = 'strong',
    Table = 'table',
    Text = 'text',
    ThematicBreak = 'thematicBreak',
    URL = 'url',
}

export interface Parent extends UnistParent {
    raw: string
}

export interface BlankLine extends Parent {
    type: NodeType.BlankLine
    count: number
}

export interface Heading extends Parent {
    type: NodeType.Heading
    depth: number
}

export interface List extends Parent {
    type: NodeType.List
    ordered: boolean
    spread: boolean
    start?: number
}

export interface ListItem extends Parent {
    type: NodeType.ListItem
    checked?: boolean
    num?: number
    spread: boolean
}

export interface Link extends Parent {
    type: NodeType.Link
    title?: string
    url: string
}

export interface Position {
    from: number
    to: number
}

export interface Element extends Position {
    attrs?: { [key: string]: unknown }
    type: string
    [key: string]: unknown
}

export interface Mark extends Element {}

export interface Node extends Element {
    marks?: Mark[]
}

export interface Decoration extends Position {
    type: string
}
