import { Schema } from 'prosemirror-model'

export type EditorSchema<
    GNodes extends string = string,
    GMarks extends string = string
> = Schema<GNodes, GMarks>

export enum ExtensionType {
    Extension = 'extension',
    Node = 'node',
    Mark = 'mark',
}

export enum FocusPosition {
    End = 'END',
    Start = 'START',
}
