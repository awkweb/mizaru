import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import { Node } from '../utils'

class ListItem extends Node {
    get name() {
        return 'list_item'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            content: 'paragraph block*',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'li' }],
            toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
                const attrs = {
                    ...(node.attrs.active ? { class: 'active' } : null),
                }
                return ['li', attrs, 0]
            },
        }
    }
}

export default ListItem
