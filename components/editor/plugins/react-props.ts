/*
 * Based on https://discuss.prosemirror.net/t/lightweight-react-integration-example/2680
 */

import { Plugin, PluginKey } from 'prosemirror-state'

const reactPropsKey = new PluginKey('reactProps')

function reactProps(config?: any): Plugin {
    return new Plugin({
        key: reactPropsKey,
        state: {
            init: () => config,
            apply: (tr, prev) => tr.getMeta(reactPropsKey) || prev,
        },
    })
}

export default reactProps
export { reactPropsKey }
