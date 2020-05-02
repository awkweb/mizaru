import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

import { Plugin as PluginExtension } from '../utils'
import { EditorProps } from '../'
import { Dispatch } from '../types'

type Props = Partial<EditorProps>

type Commands = {
    updateReactProps: (props: Props) => void
    getReactProps: () => any
}

const key = new PluginKey('reactProps')

class ReactProps extends PluginExtension {
    props: Props

    constructor(props: Props) {
        super()
        this.props = props
    }

    get name() {
        return 'reactProps'
    }

    commands(): Commands {
        return {
            updateReactProps: (props: Props) => this.updateProps(props),
            getReactProps: () => this.getProps(),
        }
    }

    updateProps(props: Props) {
        return ({ tr }: EditorState, dispatch: Dispatch) => {
            tr.setMeta(key, props)
            dispatch(tr)
        }
    }

    getProps() {
        return (state: EditorState, _: Dispatch) => {
            return key.getState(state) as Props
        }
    }

    get plugins() {
        return [
            new Plugin({
                key,
                state: {
                    init: () => this.props,
                    apply(tr, old) {
                        return tr.getMeta(key) || old
                    },
                },
            }),
        ]
    }
}

export default ReactProps
export type { Commands as ReactPropsCommands }
