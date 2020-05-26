import { history, redo, undo } from 'prosemirror-history'

import { keys } from '../constants'

import Plugin from './plugin'

class History extends Plugin {
    get name() {
        return 'history'
    }

    get plugins() {
        return [history()]
    }

    keys() {
        const { history } = keys.plugins
        return {
            [history.undo.keys]: undo,
            ...history.redo.keys.reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr]: redo,
                }),
                {},
            ),
        }
    }
}

export default History
