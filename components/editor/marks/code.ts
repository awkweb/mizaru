import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Code extends Mark {
    get name() {
        return 'code'
    }

    get schema() {
        return {
            excludes: '_',
            parseDOM: [{ tag: 'code' }],
            toDOM: (): DOMOutputSpec => ['code'],
        }
    }
}

export default Code
