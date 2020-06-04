import { Node as ProsemirrorNode } from 'prosemirror-model'
import { PluginKey, Plugin as ProsemirrorPlugin } from 'prosemirror-state'

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
        console.log(JSON.stringify(markdown))
    }

    get plugins() {
        return [
            new ProsemirrorPlugin({
                key,
                state: {
                    init: (_config, instance) => {
                        this.render(instance.doc)
                    },
                    apply: (tr, _value, _oldState, _newState) => {
                        if (tr.docChanged) {
                            this.render(tr.doc)
                        }
                    },
                },
            }),
        ]
    }
}

export default Markdown
