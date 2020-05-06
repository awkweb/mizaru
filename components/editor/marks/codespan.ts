import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Codespan extends Mark {
    get name() {
        return 'codespan'
    }

    get schema() {
        return {
            attrs: {
                class: {
                    default: null,
                },
            },
            excludes: '_',
            parseDOM: [{ tag: 'code' }],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => [
                'code',
                node.attrs,
            ],
        }
    }
}

export default Codespan
