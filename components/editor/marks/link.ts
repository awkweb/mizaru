import {
    DOMOutputSpec,
    MarkSpec,
    Mark as ProsemirrorMark,
} from 'prosemirror-model'

import { Mark } from '../utils'

class Link extends Mark {
    get name() {
        return 'link'
    }

    get schema(): MarkSpec {
        return {
            attrs: {
                class: {
                    default: null,
                },
                href: {
                    default: null,
                },
                title: {
                    default: null,
                },
            },
            parseDOM: [
                {
                    tag: 'a[href]',
                    getAttrs: (dom: string | Node) => ({
                        // @ts-ignore
                        href: dom.getAttribute('href'),
                    }),
                },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => [
                'a',
                { ...node.attrs, rel: 'noopener noreferrer nofollow' },
            ],
        }
    }
}

export default Link
