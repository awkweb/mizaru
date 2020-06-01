import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class ListItem extends Node {
    get name() {
        return 'listItem'
    }

    get schema() {
        return {
            content: 'paragraph block*',
            defining: true,
            draggable: false,
            parseDOM: [{ tag: 'li' }],
            toDOM: (_node: ProsemirrorNode): DOMOutputSpec => {
                return ['li', 0]
            },
        }
    }
}

export default ListItem
