import { NodeSpec } from 'prosemirror-model'

import Extension from './extension'

class Node extends Extension {
    get type(): string {
        return 'node'
    }

    get schema(): NodeSpec {
        return {}
    }
}

export default Node
