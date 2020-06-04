import { Node as UnistNode, Parent as UnistParent } from 'unist'

import { NodeType } from '../../../types'

export interface Parent extends UnistParent {
    raw: string
}

export interface Node extends UnistNode {}

export interface BlankLine extends Node {
    type: NodeType.BlankLine
    count: number
}
