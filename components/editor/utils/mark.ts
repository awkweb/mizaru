import { MarkSpec } from 'prosemirror-model'

import Extension from './extension'
import { ExtensionType } from '../types'

class Mark extends Extension {
    get type() {
        return ExtensionType.Mark
    }

    get schema(): MarkSpec {
        return {}
    }
}

export default Mark
