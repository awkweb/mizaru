import { NodeSpec } from 'prosemirror-model'

import { Extension } from '../utils'

class Node extends Extension {
    get type() {
        return Extension.Type.Node
    }

    get schema(): NodeSpec {
        return {}
    }
}

export default Node
