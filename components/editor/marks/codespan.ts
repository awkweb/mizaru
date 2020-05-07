import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Codespan extends Mark {
    get name() {
        return 'codespan'
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
                const activeClasses = node.attrs.active ? ['active'] : ['px-1']
                const classes = [
                    ...activeClasses,
                    'bg-muted',
                    'leading-normal',
                    'py-px',
                    'rounded-sm',
                    'text-sm',
                ]
                const attrs = {
                    class: classes.join(' '),
                }
                return ['code', attrs]
            },
        }
    }
}

export default Codespan
