import { DOMOutputSpec } from 'prosemirror-model'

import { Node } from '../utils'

class UnorderedList extends Node {
    get name() {
        return 'unordered_list'
    }

    get schema() {
        return {
            content: 'list_item+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM: (): DOMOutputSpec => ['ul', 0],
        }
    }
}

export default UnorderedList
