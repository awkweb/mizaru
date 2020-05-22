import { DOMOutputSpec } from 'prosemirror-model'

import { Node } from '../utils'

class UnorderedList extends Node {
    get name() {
        return 'unorderedList'
    }

    get schema() {
        return {
            content: 'listItem+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM: (): DOMOutputSpec => ['ul', 0],
        }
    }
}

export default UnorderedList
