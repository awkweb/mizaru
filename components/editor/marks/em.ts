import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Em extends Mark {
    get name() {
        return 'em'
    }

    get schema() {
        return {
            attrs: {
                class: {
                    default: null,
                },
            },
            parseDOM: [
                { tag: 'i' },
                { tag: 'em' },
                { style: 'font-style=italic' },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => [
                'em',
                node.attrs,
            ],
        }
    }
}

export default Em
