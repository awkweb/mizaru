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
                    class: this.getClasses(level, active),
                    ...rest,
                }
                return [`h${level}`, attrs, 0]
            },
        }
    }

    private getClasses(level: number, active: boolean) {
        let levelClasses
        switch (level) {
            case 3:
                levelClasses = ['mb-2', 'mt-4', 'text-xl']
                break
            case 2:
                levelClasses = ['mb-2', 'mt-5', 'text-2xl']
                break
            case 1:
                levelClasses = ['mb-3', 'mt-6', 'text-3xl']
                break
            default:
                levelClasses = ['mb-1', 'mt-3', 'text-lg']
        }
        const activeClasses = active ? ['active'] : []
        const classes = [
            ...activeClasses,
            ...levelClasses,
            'font-bold',
            'leading-tight',
        ]
        return classes.join(' ')
    }
}

export default Heading
