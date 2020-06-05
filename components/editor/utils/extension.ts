import { EditorState, Plugin } from 'prosemirror-state'

import { EditorView } from 'prosemirror-view'

enum Type {
    Extension = 'extension',
    Node = 'node',
    Mark = 'mark',
    Plugin = 'plugin',
}

type Command = (
    attrs: object,
) => (state: EditorState, dispatch: EditorView['dispatch']) => any

abstract class Extension {
    public static Type = Type

    get name() {
        return ''
    }

    get type() {
        return Extension.Type.Extension
    }

    get defaultOptions() {
        return {}
    }

    get plugins(): Plugin[] {
        return []
    }

    keys(keys: { [key: string]: any }) {
        return { ...keys }
    }

    commands(_options?: any): Record<string, Command> | Command {
        return (_attrs) => () => false
    }
}

export default Extension
