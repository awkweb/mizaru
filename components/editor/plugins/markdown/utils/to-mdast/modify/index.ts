import { Modifier } from 'unist-util-modify-children'

import { NodeType } from '../../../types'
import { Node, Parent } from '../types'
import blankLine from './blank-line'
import blockquote from './blockquote'
import emphasis from './emphasis'
import heading from './heading'
import strong from './strong'

type BlockModifier = (node: Node, tree: Parent) => number | void

interface Block {
    [NodeType.BlankLine]: BlockModifier
    [NodeType.Blockquote]: BlockModifier
    [NodeType.Heading]: BlockModifier
    [key: string]: BlockModifier
}

interface Inline {
    [NodeType.Blockquote]: Modifier
    [NodeType.Emphasis]: Modifier
    [NodeType.Strong]: Modifier
    [key: string]: Modifier
}

const block: Block = {
    blankLine,
    blockquote: blockquote.block,
    heading,
}

const inline: Inline = {
    blockquote: blockquote.inline,
    emphasis,
    strong,
}

const modify = { block, inline }

export default modify
