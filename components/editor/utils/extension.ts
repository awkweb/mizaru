import { Plugin } from 'prosemirror-state'
import { MarkType } from 'prosemirror-model'

import { EditorSchema, ExtensionType } from '../types'

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

    plugins(_: { schema?: EditorSchema; type?: MarkType }): Plugin<any, any>[] {
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
