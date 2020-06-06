import { Modifier } from 'unist-util-modify-children'

import { NodeType } from '../../../types'
import { Node, Parent } from '../types'
import blankLine from './blank-line'
import emphasis from './emphasis'
import heading from './heading'
import strong from './strong'

type BlockModifier = (node: Node, tree: Parent) => void

interface Block {
    [NodeType.BlankLine]: BlockModifier
    [NodeType.Heading]: BlockModifier
    [key: string]: BlockModifier
}

interface Inline {
    [NodeType.Emphasis]: Modifier
    [NodeType.Strong]: Modifier
    [key: string]: Modifier
}

const block: Block = {
    blankLine,
    heading,
}

const inline: Inline = {
    emphasis,
    strong,
}

const modify = { block, inline }

export default modify
