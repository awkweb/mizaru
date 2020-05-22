import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Emphasis extends Mark {
    get name() {
        return 'emphasis'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            parseDOM: [
                { tag: 'i' },
                { tag: 'em' },
                { style: 'font-style=italic' },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => {
                const attrs = {
                    ...(node.attrs.active ? { class: 'active' } : null),
                }
                return ['em', attrs]
            },
        }
    }
}

export default Emphasis
