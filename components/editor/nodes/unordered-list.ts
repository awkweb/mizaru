import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class UnorderedList extends Node {
    get name() {
        return 'unorderedList'
    }

    get schema() {
        return {
            content: 'listItem+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM: (_node: ProsemirrorNode): DOMOutputSpec => {
                return ['ul', 0]
            },
        }
    }
}

export default UnorderedList
