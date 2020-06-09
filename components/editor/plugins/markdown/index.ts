import { Node as ProsemirrorNode } from 'prosemirror-model'
import {
    PluginKey,
    Plugin as ProsemirrorPlugin,
    TextSelection,
} from 'prosemirror-state'

import Plugin from '../plugin'
import { toMarkdown } from '../../utils'
import { toMDAST, toPMAST } from './utils'

const key = new PluginKey('markdown')

class Markdown extends Plugin {
    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode) {
        const markdown = toMarkdown(doc)
        const mdast = toMDAST(markdown)
        const pmast = toPMAST(mdast)
        return pmast
    }

    get plugins() {
        return [
            new ProsemirrorPlugin({
                key,
                state: {
                    init: (_config, instance) => {
                        const json = this.render(instance.doc)
                        return { json }
                    },
                    apply: (tr, value, _oldState, _newState) => {
                        if (!tr.docChanged) {
                            return value
                        }

                        const json = this.render(tr.doc)
                        return { json }
                    },
                },
                view: () => ({
                    update: (view, prevState) => {
                        const { state } = view
                        const { json } = key.getState(state)

                        if (prevState.doc.eq(state.doc) || !json) {
                            return
                        }

                        const { doc, selection, schema, tr } = state

                        // Swap document content
                        const node = schema.nodeFromJSON(json)
                        tr.replaceWith(0, doc.content.size, node.content)

                        // Force selection to remain in last place
                        const newSelection = TextSelection.create(
                            state.apply(tr).doc,
                            selection.anchor,
                            selection.head,
                        )
                        tr.setSelection(newSelection)

                        view.dispatch(tr)
                    },
                }),
            }),
        ]
    }
}

export default Markdown
