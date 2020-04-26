import { redo, undo } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'

const keymap = {
    'Mod-z': undo,
    'Shift-Mod-z': redo,
    'Mod-y': redo,
    ...baseKeymap,
}

export default keymap
