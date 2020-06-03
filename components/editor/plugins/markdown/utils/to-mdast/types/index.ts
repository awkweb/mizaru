import { Node as UnistNode, Parent as UnistParent } from 'unist'

export enum NodeType {
    AutoLink = 'autoLink',
    BlankLine = 'blankLine',
    Blockquote = 'blockquote',
    Break = 'break',
    Code = 'code',
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
    NewLine = 'newLine',
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

export interface Node extends UnistNode {}

export interface BlankLine extends Node {
    type: NodeType.BlankLine
    count: number
}
