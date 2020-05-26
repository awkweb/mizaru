import { DOMOutputSpec, Mark as ProsemirrorMark } from 'prosemirror-model'

import Mark from './mark'

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
                        (<HTMLElement>node).style.fontWeight !== 'normal' &&
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
                    class: this.getClasses(node.attrs.active),
                }
                return ['strong', attrs]
            },
        }
    }

    private getClasses(active: boolean) {
        const activeClasses = active ? ['active'] : []
        const classes = [...activeClasses, 'font-bold']
        return classes.join(' ')
    }
}

export default Strong
