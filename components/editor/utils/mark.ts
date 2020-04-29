import { MarkSpec } from 'prosemirror-model'

import Extension from './extension'

class Mark extends Extension {
    get type(): string {
        return 'mark'
    }

    get schema(): MarkSpec {
        return {}
    }
}

export default Mark
