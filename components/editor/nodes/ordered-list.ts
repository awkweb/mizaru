import { DOMOutputSpec } from 'prosemirror-model'

import { Node } from '../utils'

class OrderedList extends Node {
    get name() {
        return 'orderedList'
    }

    get schema() {
        return {
            content: 'listItem+',
            group: 'block',
            parseDOM: [{ tag: 'ol' }],
            toDOM: (): DOMOutputSpec => ['ol', 0],
        }
    }
}

export default OrderedList
