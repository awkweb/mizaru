import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Italic extends Mark {
    get name() {
        return 'italic'
    }

    get schema() {
        return {
            parseDOM: [
                { tag: 'i' },
                { tag: 'em' },
                { style: 'font-style=italic' },
            ],
            toDOM: (): DOMOutputSpec => ['em'],
        }
    }
}

export default Italic
