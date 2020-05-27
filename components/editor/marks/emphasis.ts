import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import Mark from './mark'

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
                    class: this.getClasses(node.attrs.active),
                }
                return ['em', attrs]
            },
        }
    }

    private getClasses(active: boolean) {
        const activeClasses = active ? ['active'] : []
        const classes = [...activeClasses, 'italic']
        return classes.join(' ')
    }
}

export default Emphasis
