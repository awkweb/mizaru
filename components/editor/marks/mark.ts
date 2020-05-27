import { MarkSpec } from 'prosemirror-model'

import { Extension } from '../utils'

class Mark extends Extension {
    get type() {
        return Extension.Type.Mark
    }

    get schema(): MarkSpec {
        return {}
    }
}

export default Mark
