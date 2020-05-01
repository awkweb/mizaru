import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

import { Plugin as PluginExtension } from '../utils'

const key = new PluginKey('reactProps')

class ReactProps extends PluginExtension {
    initialProps: { [key: string]: any }

    constructor(initialProps = {}) {
        super()
        this.initialProps = initialProps
    }

    get name() {
        return 'reactProps'
    }

    commands() {
        return {
            updateReactProps: (props: any) => this.updateProps(props),
            getReactProps: () => this.getProps(),
        }
    }

    updateProps(props: any) {
        return ({ tr }: EditorState, dispatch: any) => {
            tr.setMeta(key, props)
            dispatch(tr)
        }
    }

    getProps() {
        return (state: EditorState, _dispatch: any) => {
            return key.getState(state)
        }
    }

    get plugins() {
        return [
            new Plugin({
                key,
                state: {
                    init: () => this.initialProps,
                    apply(tr, old) {
                        return tr.getMeta(key) || old
                    },
                },
            }),
        ]
    }
}

export default ReactProps
