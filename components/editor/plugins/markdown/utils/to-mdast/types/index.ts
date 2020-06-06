import { Node as UnistNode, Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'

export interface Parent extends UnistParent {
    raw: string
}

export interface Node extends UnistNode {
    raw: string
}

export interface BlankLine extends Node {
    type: NodeType.BlankLine
    count: number
}

export interface Heading extends Node {
    type: NodeType.Heading
    depth: number
}
