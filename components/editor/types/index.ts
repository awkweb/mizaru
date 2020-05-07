import { Schema } from 'prosemirror-model'
import { Ref } from 'react'
import { Transaction } from 'prosemirror-state'

export type Dispatch = (tr: Transaction) => void

export type EditorSchema<
    GNodes extends string = string,
    GMarks extends string = string
> = Schema<GNodes, GMarks>

export type EditorRef = Ref<{
    focus: () => void
}>

export type EditorSelection = {
    from: number
    to: number
}

export enum ExtensionType {
    Extension = 'extension',
    Node = 'node',
    Mark = 'mark',
    Plugin = 'plugin',
}

export enum FocusPosition {
    End = 'END',
    Start = 'START',
}

export enum DecorationType {
    Syntax = 'syntax',
    Preview = 'preview',
}
