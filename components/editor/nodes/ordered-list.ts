import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import Node from './node'

class OrderedList extends Node {
    get name() {
        return 'orderdList'
    }

    get schema() {
        return {
            attrs: {
                order: {
                    default: 1,
                },
            },
            content: 'listItem+',
            group: 'block',
            parseDOM: [
                {
                    tag: 'ol',
                    getAttrs: (dom: any) => ({
                        order: dom.hasAttribute('start')
                            ? +(<string>dom.getAttribute('start'))
                            : 1,
                    }),
                },
            ],
            toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
                const attrs = {
                    start: node.attrs.order ?? 1,
                }
                return ['ol', attrs, 0]
            },
        }
    }
}

export default OrderedList
