import { DOMOutputSpec } from 'prosemirror-model'

import { Mark } from '../utils'

class Del extends Mark {
    get name() {
        return 'del'
    }

    get schema() {
        return {
            parseDOM: [
                { tag: 'strike' },
                { tag: 'del' },
                { style: 'text-decoration=line-through' },
            ],
            toDOM: (): DOMOutputSpec => ['del'],
        }
    }
}

export default Del
