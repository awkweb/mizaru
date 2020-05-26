import { PluginKey, Plugin as ProsemirrorPlugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import Plugin from './plugin'

const key = new PluginKey('placeholder')

type Props = {
    placeholderClass: string
    placeholderText: string
}

class Placeholder extends Plugin {
    props: Props

    constructor(props?: Partial<Props>) {
        super()

        this.props = {
            placeholderClass: 'is-empty',
            placeholderText: 'Write something …',
            ...props,
        }
    }

    get name() {
        return 'placeholder'
    }

    get plugins() {
        return [
            new ProsemirrorPlugin({
                key,
                props: {
                    decorations: ({ doc }) => {
                        const decorations: Decoration[] = []
                        const completelyEmpty =
                            doc.textContent === '' &&
                            doc.childCount <= 1 &&
                            doc.content.size <= 2

                        doc.descendants((node, pos) => {
                            if (!completelyEmpty) {
                                return
                            }
                            if (pos !== 0 || node.type.name !== 'paragraph') {
                                return
                            }

                            const decoration = Decoration.node(
                                pos,
                                pos + node.nodeSize,
                                {
                                    class: this.props.placeholderClass,
                                    'data-empty-text': this.props
                                        .placeholderText,
                                },
                            )
                            decorations.push(decoration)
                        })

                        return DecorationSet.create(doc, decorations)
                    },
                },
            }),
        ]
    }
}

export default Placeholder
