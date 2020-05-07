import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import { Mark } from '../utils'

class Strong extends Mark {
    get name() {
        return 'strong'
    }

    get schema() {
        return {
            attrs: {
                active: {
                    default: false,
                },
            },
            parseDOM: [
                {
                    tag: 'strong',
                },
                {
                    tag: 'b',
                    getAttrs: (node: string | Node) =>
                        (node as HTMLElement).style.fontWeight !== 'normal' &&
                        null,
                },
                {
                    style: 'font-weight',
                    getAttrs: (value: string | Node) =>
                        /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) &&
                        null,
                },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => {
                const attrs = {
                    ...(node.attrs.active ? { class: 'active' } : null),
                }
                return ['strong', attrs]
            },
        }
    }
}

export default Strong
