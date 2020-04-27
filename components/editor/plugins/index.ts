import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'

import baseKeymap from '../keymap'
import reactProps, { reactPropsKey } from './react-props'
import markdown from './markdown'

const pluginKeys = {
    reactPropsKey,
}

function createPlugins(props: any) {
    return [history(), reactProps(props), keymap(baseKeymap), markdown()]
}

export { pluginKeys, createPlugins }
