import { Node as ProsemirrorNode } from 'prosemirror-model'
import { PluginKey, Plugin as ProsemirrorPlugin } from 'prosemirror-state'

import Plugin from '../plugin'
import { toMarkdown } from '../../utils'
import { toMDAST } from './utils'

const key = new PluginKey('markdown')

class Markdown extends Plugin {
    get name() {
        return 'markdown'
    }

    render(doc: ProsemirrorNode) {
        const content = toMarkdown(doc)
        toMDAST(content)
        console.log(JSON.stringify(content))
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
