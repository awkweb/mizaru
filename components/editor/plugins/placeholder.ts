import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { Plugin as PluginExtension } from '../utils'

const key = new PluginKey('placeholder')

type Props = {
    emptyEditorClass: string
    emptyNodeClass: string
    emptyNodeText: string
    showOnlyCurrent: boolean
}

class Placeholder extends PluginExtension {
    props: Props

    constructor(props?: Partial<Props>) {
        super()

        this.props = {
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Write something …',
            showOnlyCurrent: true,
            ...props,
        }
    }

    get name() {
        return 'placeholder'
    }

    get plugins() {
        return [
            new Plugin({
                key,
                props: {
                    decorations: ({ doc, selection }) => {
                        const { anchor } = selection
                        const decorations: Decoration[] = []
                        const isEditorEmpty = doc.textContent.length === 0

                        doc.descendants((node, pos) => {
                            const hasAnchor =
                                anchor >= pos && anchor <= pos + node.nodeSize
                            const isNodeEmpty = node.content.size === 0

                            if (
                                (hasAnchor || !this.props.showOnlyCurrent) &&
                                isNodeEmpty
                            ) {
                                const classes = [this.props.emptyNodeClass]

                                if (isEditorEmpty) {
                                    classes.push(this.props.emptyEditorClass)
                                }

                                const decoration = Decoration.node(
                                    pos,
                                    pos + node.nodeSize,
                                    {
                                        class: classes.join(' '),
                                        'data-empty-text': this.props
                                            .emptyNodeText,
                                    },
                                )
                                decorations.push(decoration)
                            }

                            return false
                        })

                        return DecorationSet.create(doc, decorations)
                    },
                },
            }),
        ]
    }
}

export default Placeholder
