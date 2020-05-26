import { history, redo, undo } from 'prosemirror-history'

import Plugin from './plugin'

class History extends Plugin {
    get name() {
        return 'history'
    }

    get plugins() {
        return [history()]
    }

    keys() {
        return {
            'Mod-z': undo,
            'Mod-y': redo,
            'Shift-Mod-z': redo,
        }
    }
}

export default History
