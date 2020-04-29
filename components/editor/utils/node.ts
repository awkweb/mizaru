import { NodeSpec } from 'prosemirror-model'

import Extension from './extension'
import { ExtensionType } from '../types'

class Node extends Extension {
    get type() {
        return ExtensionType.Node
    }

    get schema(): NodeSpec {
        return {}
    }
}

export default Node
