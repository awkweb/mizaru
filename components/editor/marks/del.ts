import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Del extends Mark {
    get name() {
        return 'del'
    }

    get schema() {
        return {
            attrs: {
                class: {
                    default: null,
                },
            },
            parseDOM: [
                { tag: 'strike' },
                { tag: 'del' },
                { style: 'text-decoration=line-through' },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => [
                'del',
                node.attrs,
            ],
        }
    }
}

export default Del
