import { Plugin } from 'prosemirror-state'

import { ExtensionType } from '../types'

class Extension {
    get type(): ExtensionType {
        return ExtensionType.Extension
    }

    get plugins(): Plugin<any, any>[] {
        return []
    }

    keys(keys: { [key: string]: any }) {
        return { ...keys }
    }
}

export default Extension
