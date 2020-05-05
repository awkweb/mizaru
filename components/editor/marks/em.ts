import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Em extends Mark {
    get name() {
        return 'em'
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

export default Em
