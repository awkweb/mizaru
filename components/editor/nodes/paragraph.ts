import { DOMOutputSpec } from 'prosemirror-model'

import Node from './node'

class Paragraph extends Node {
    get name() {
        return 'paragraph'
    }

    get schema() {
        return {
            content: 'inline*',
            group: 'block',
            draggable: false,
            parseDOM: [
                {
                    tag: 'p',
                },
            ],
            toDOM: (): DOMOutputSpec => ['p', 0],
        }
    }
}

export default Paragraph
