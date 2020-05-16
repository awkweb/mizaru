import { DOMOutputSpec } from 'prosemirror-model'

import { Node } from '../utils'

class OrderedList extends Node {
    get name() {
        return 'ordered_list'
    }

    get schema() {
        return {
            content: 'list_item+',
            group: 'block',
            parseDOM: [{ tag: 'ol' }],
            toDOM: (): DOMOutputSpec => ['ol', 0],
        }
    }
}

export default OrderedList
