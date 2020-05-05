import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Codespan extends Mark {
    get name() {
        return 'codespan'
    }

    get schema() {
        return {
            excludes: '_',
            parseDOM: [{ tag: 'code' }],
            toDOM: (): DOMOutputSpec => ['code'],
        }
    }
}

export default Codespan
