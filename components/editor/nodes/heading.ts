import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'

import { Node } from '../utils'

interface Props {
    levels: number[]
}

class Heading extends Node {
    props: Props

    constructor() {
        super()

        this.props = {
            levels: [1, 2, 3, 4, 5, 6],
        }
    }

    get name() {
        return 'heading'
    }

    get schema() {
        return {
            attrs: {
                level: {
                    default: 1,
                },
                active: {
                    default: false,
                },
            },
            content: 'inline*',
            group: 'block',
            defining: true,
            draggable: false,
            parseDOM: this.props.levels.map((level) => ({
                tag: `h${level}`,
                attrs: { level },
            })),
            toDOM: (node: ProsemirrorNode): DOMOutputSpec => {
                const { active, level, ...rest } = node.attrs
                const attrs = {
                    ...(active ? { class: 'active' } : null),
                    ...rest,
                }
                return [`h${level}`, attrs, 0]
            },
        }
    }
}

export default Heading
