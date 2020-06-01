import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class HardBreak extends Node {
    get name() {
        return 'hardBreak'
    }

    get schema() {
        return {
            inline: true,
            group: 'inline',
            selectable: false,
            parseDOM: [{ tag: 'br' }],
            toDOM: (_node: ProsemirrorNode): DOMOutputSpec => ['br'],
        }
    }
}

export default HardBreak
