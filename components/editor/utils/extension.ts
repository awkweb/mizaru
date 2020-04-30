import { Plugin } from 'prosemirror-state'

import { ExtensionType } from '../types'

abstract class Extension {
    get name(): string {
        return ''
    }

    get type(): ExtensionType {
        return ExtensionType.Extension
    }

    get defaultOptions() {
        return {}
    }

    get plugins(): Plugin<any, any>[] {
        return []
    }

    keys(keys: { [key: string]: any }) {
        return { ...keys }
    }

    commands(): { [key: string]: Function } {
        return {}
    }
}

export default Extension
