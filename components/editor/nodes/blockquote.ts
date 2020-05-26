import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class Blockquote extends Node {
    get name() {
        return 'blockquote'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            content: 'block*',
            group: 'block',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'blockquote' }],
            toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
                const attrs = {
                    ...(node.attrs.active ? { class: 'active' } : null),
                }
                return ['blockquote', attrs, 0]
            },
        }
    }
}

export default Blockquote
