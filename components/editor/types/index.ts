import { Schema } from 'prosemirror-model'
import { Ref } from 'react'

export type EditorSchema<
    GNodes extends string = string,
    GMarks extends string = string
> = Schema<GNodes, GMarks>

export type EditorRef = Ref<{
    focus: () => void
}>

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
