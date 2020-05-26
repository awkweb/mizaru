import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import Mark from './mark'

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
                    class: this.getClasses(node.attrs.active),
                }
                return ['del', attrs]
            },
        }
    }

    private getClasses(active: boolean) {
        const activeClasses = active ? ['active'] : []
        const classes = [...activeClasses, 'no-underline']
        return classes.join(' ')
    }
}

export default Delete
