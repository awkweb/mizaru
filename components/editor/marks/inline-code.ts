import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class InlineCode extends Mark {
    get name() {
        return 'inlineCode'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            excludes: '_',
            parseDOM: [{ tag: 'code' }],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => {
                const attrs = {
                    class: this.getClasses(node.attrs.active),
                }
                return ['code', attrs]
            },
        }
    }

    private getClasses(active: boolean) {
        const activeClasses = active ? ['active'] : ['px-1']
        const classes = [
            ...activeClasses,
            'bg-muted',
            'leading-normal',
            'py-px',
            'rounded-sm',
        ]
        return classes.join(' ')
    }
}

export default InlineCode
