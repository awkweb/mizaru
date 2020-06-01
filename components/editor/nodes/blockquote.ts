import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class Blockquote extends Node {
    get name() {
        return 'blockquote'
    }

    get schema() {
        return {
            content: 'block*',
            group: 'block',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'blockquote' }],
            toDOM: (_node: ProsemirrorNode): DOMOutputSpec => {
                return ['blockquote', 0]
            },
        }
    }
}

export default Blockquote
