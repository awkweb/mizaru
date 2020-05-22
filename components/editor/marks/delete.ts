import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Delete extends Mark {
    get name() {
        return 'delete'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            parseDOM: [
                { tag: 's' },
                { tag: 'strike' },
                { tag: 'del' },
                { style: 'text-decoration=line-through' },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => {
                const attrs = {
                    ...(node.attrs.active ? { class: 'active' } : null),
                }
                return ['del', attrs]
            },
        }
    }
}

export default Delete
