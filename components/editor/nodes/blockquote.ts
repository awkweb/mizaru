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
                    class: this.getClasses(node.attrs.active),
                }
                return ['blockquote', attrs, 0]
            },
        }
    }
    private getClasses(active: boolean) {
        const activeClasses = active ? ['active'] : []
        const classes = [...activeClasses, 'border-l', 'border-syntax']
        return classes.join(' ')
    }
}

export default Blockquote
